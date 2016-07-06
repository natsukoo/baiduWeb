// 设置图片合并的最小间隔
//fis.config.set('settings.spriter.csssprites.margin', 20);

// 开启simple插件，注意需要先进行插件安装 npm install -g fis-postpackager-simple
fis.config.set('modules.postpackager', 'simple');

// 设置打包规则
fis.config.set('pack', {
    '/pkg/lib.js': [
        'js/lib/jquery.js',
        'js/lib/underscore.js',
        'js/lib/backbone.js',
        'js/lib/backbone.localStorage.js',
    ],
    // 设置CSS打包规则，假如在引用图片的路径后加了？_inline，则图片也会被合并CSS打包的同时会进行图片合并
    '/pkg/aio.css': ['**.css']
});

// 利用simple插件对零散资源的自动合并
fis.config.set('settings.postpackager.simple.autoCombine', true);

//后缀名的less的文件安装使用fis-parser-less这个插件编译
//modules.parser.less表示设置后缀名为less的文件的parser，第二个less表示使用fis-parser-less进行编译
// fis.config.set('modules.parser.less', 'less');
//将less文件编译为css
// fis.config.set('roadmap.ext.less', 'css');
//fis调整了编译产出的目录结构，还将所有引用资源的地方也都调整为发布路径，还将所有的css添加了域名。
fis.config.merge({
    roadmap : {
        domain : {
            //所有css文件添加http://localhost:8080作为域名
            '**.css' : 'http://localhost:8080'
        },
        path : [
            {
                //所有的js文件
                reg : '**.js',
                //发布到/static/js/xxx目录下
                release : '/static/js$&'
            },
            {
                //所有的css文件
                reg : '**.css',
                //发布到/static/css/xxx目录下
                release : '/static/css$&'
            },
            {
                //所有image目录下的.png，.gif文件
                reg : /^\/images\/(.*\.(?:png|gif))/i,
                //发布到/static/pic/xxx目录下
                release : '/static/pic/$1'
            }
        ]
    }
});
这里还不太懂merge和set的关系与区别。貌似作用都差不太多

因此我们将release设置为/static/$1， 还记得$1的内容是moduleA/a.js么？通过$1引用捕获路径我们就可以将/modules/moduleA/a.js 在产出目录中移动到 /static/moduleA/a.js了。
当然，使用glob规则我们也可以移动文件，但是由于没有正则捕获组的支持，我们只能通过$&获取整体路径，比如通过下面这个规则，我们可以将所有html文件在产出目录中移动到/page目录下
除了路径调整外，FIS还可以通过设置，调整资源引用的query，通过这个功能，你可以用他进行自动添加时间戳之类的功能



fis.config.set('roadmap.path',[
    {
        reg: /^\/modules\/(.*)/i,
        release: '/static/modules/$1'
    },
    {
        reg: "**.html",
        release: '$&'
    }
]);

默认依赖

默认依赖的设置用于批量添加一些基础资源的依赖，而不用在每个文件中重复添加，比如最常见的base.css， 我们可以设置所有样式都依赖这个基础样式，这样输出map.json文件时，依赖中就会自动添加base.css项。

fis.config.set('roadmap.path',[
    {
        reg : "**.css"
        requires : ['/css/base.css']
    },
]);
roadmap.path 不建议多次配置，由于roadmap.path本身是一个数组，因此如果多次 fis.config.set ，后一次的设置会覆盖前一次的设置，而 fis.config.merge 则完全无效，并且会提示无法merge此属性。

如果想要干预已经设置过的roadmap.path，可以使用 fis.config.get('roadmap.path') 取出配置后操作roadmap.path数组。

比如希望添加一个高优先级的处理设置，则可以通过unshift将规则插入配置

fis.config.set('roadmap.path',[
    {
        reg : '**.css',
        useHash: true
    }
]);

/*
//错误的方法，将会导致roadmap.path设置只有aio.css的规则
fis.config.set('roadmap.path',[
    {
        reg : 'aio.css',
        useHash: false
    }
]);
*/

//正确的方法
fis.config.get('roadmap.path').unshift({
    reg : 'aio.css',
    useHash: false
});

roadmap.path 是 顺序敏感 的，每个文件在处理过程中都会使用roadmap.path从上到下对文件路径进行匹配，一旦匹配成功，就会停止匹配，并将匹配项的配置赋给文件。因此 最顶部的规则，优先级越高 。此外即使一个文件可以匹配多个规则，也只会获得 第一次 匹配的配置。

举个例子，我们可能已经有了一个配置，这个配置的含义是将/modules文件夹下的内容都复制到/static/modules下

fis.config.set('roadmap.path',[
    {
        reg: /^\/modules\/(.*)/i,
        release: '/static/modules/$1'
    }
]);
但是我们可能会希望一些文件进行特殊的设置，比如设置所有CSS文件进行图片合并。

fis.config.set('roadmap.path',[
    {
        reg: /^\/modules\/(.*\.css)$/i,
        useSprite: true
    },
    {
        reg: /^\/modules\/(.*)/i,
        release: '/static/modules/$1'
    }
]);
看似我们设置的很正确，但是一旦执行构建，你就会发现所有modules文件夹下的css文件没有被产出到static目录下，这就是因为CSS文件已经命中了第一条规则，而第一条规则中没有release属性，因此就无法产出到static目录中。如何修改正确？自然就是给第一条规则也加上同样的release设置使其和原输出目录保持一致。

引用配置

比如资源引用路径的时间戳功能，我们可能希望不用自己写具体的日期，实际上规则的release属性支持配置替换能力，举个例子

fis.config.set('static','/static');

fis.config.set('roadmap.path',[
    {
        reg: /^\/modules\/(.*)/i,
        release: '${static}/modules/$1'
    }
]);
上面的例子中release中没有直接写/static/$1而是写为了${static}/$1 ，FIS会将配置中的static属性自动替换${static}，那么自动生成时间戳该怎么写呢？不妨自己试试看=v=（难道是 new Date()?）

