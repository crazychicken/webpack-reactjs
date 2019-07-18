var path = require("path");
var webpack = require("webpack");
const merge = require("webpack-merge");
const webpackDevServer = require("webpack-dev-server");
// Utilities
const DashboardPlugin = require("webpack-dashboard/plugin");
// Common config webpack dev + pro
const common = require("./webpack.common.js")("development");
// Config only for development
const serverConfig = merge(common, {
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new DashboardPlugin()
    ].filter(Boolean)
});

const envHost = process.env.HOST || "0.0.0.0";
const envPort = process.env.PORT || 3000;
const envProtocol = process.env.HTTPS === "true" ? "https" : "http";

const options = {
    devServer: {
        // allowedHosts: ["sub.domain.tuds"],
        // devServer.clientLogLevel may be too verbose, you can turn logging off by setting it to 'silent'.
        // Thông báo lỗi, thường là không cần thiết lắm
        clientLogLevel: "none",
        // Enables/Disables colors on the console.
        // stats: { colors: true }, not need
        // Enable gzip compression for everything served
        compress: true,
        // Nói vói webpack việc trí cần chạy project
        contentBase: path.join(__dirname, "../dist"),
        // When set to true this option bypasses host checking. THIS IS NOT RECOMMENDED as apps that do not check the host are vulnerable to DNS rebinding attacks
        // Không khuyết khích vì dễ bị lỗi bảo mật
        disableHostCheck: true,

        // Chỉ sử dụng khi output 1 file duy nhất, và xác định được rõ tên, kết hợp với option lazy, thường thì khi không cần dùng
        // filename: "main.js",

        historyApiFallback: {
            // Paths with dots should still use the history fallback.
            // See https://github.com/facebook/create-react-app/issues/387.
            disableDotRule: true
        },
        // ID host - ở local 0.0.0.0
        host: envHost,

        // Tắt/Mở HMR - Hot modules Replacement, chạy đúng phần code, modules thay đổi, chứ không phải chạy là tất cả.
        hot: true,
        // Tương tự devServer.hot nhưng không reload page
        // hotOnly: true,

        // Default là http có thể setup lại https
        https: envProtocol === "https",

        // The filename that is considered the index file.
        // Chỉ định tên file gốc cụ thể khi khởi chạy
        // index: 'index.html',

        // Default option là true, đảm bảo các thông báo lỗi ở console.log() của browser. Khi đổi lại là false đồng nghĩ việc tắt luôn reload page ngoài browser
        inline: true,

        // Nếu sử dụng phải bắt buộc kết hợp với filename
        // Khi dùng thì watchOWaeons bị vô hiệu
        // lazy: true,

        // Lỗi và cảnh báo sẽ vẫn được hiển thị trong terminal;
        noInfo: true,

        // Tells dev-server to open the browser after server had been started. Set it to true to open your default browser.
        // open: true,

        // Shows a full-screen overlay in the browser when there are compiler errors or warnings.
        // overlay: true,
        // overlay: {
        //     warnings: true,
        //     errors: true
        // },

        // Port để chạy project default 8080
        port: envPort,

        // progress: true,
        public: "sub.domain.tuds",
        publicPath: "/",

        // Tắt thông báo lỗi trên terminal khi khởi chạy webpack
        // quiet: false,

        // stats: {
        //   colors: true
        // },
        // By default files from `contentBase` will not trigger a page reload.
        // Khi có thay đổi của file từ contentBase, sẽ tự reload page, cả file .js, .css .v.v...
        watchContentBase: true,
        // For some systems, watching many file systems can result in a lot of CPU or memory usage. It is possible to exclude a huge folder like node_modules:
        // Giảm thiểu việc sử dụng nhiều CPU hoặc bộ nhớ bằng việc ẩn các library từ /node_modules/
        // More options: https://webpack.js.org/configuration/watch/
        watchOptions: {
            ignored: /node_modules/
        }
    }
};
// To enable HMR, you also need to modify your webpack configuration object to include the HMR entry points. The webpack-dev-server package includes a method called addDevServerEntrypoints which you can use to do this.
webpackDevServer.addDevServerEntrypoints(serverConfig, options.devServer);
const compiler = webpack(serverConfig);
const server = new webpackDevServer(compiler, options.devServer);
server.listen(envPort, envHost, function(err) {
    if (err) {
        if (err) throw new gutil.PluginError("webpack-dev-server", err);
    }
});
