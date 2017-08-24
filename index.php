<?php
require 'vendor/autoload.php';
$dotenv = new Dotenv\Dotenv(__DIR__);
$dotenv->load();
$isProduction = 'production' === getenv('APP_ENV');
?>

<!DOCTYPE html>
<html>
    <head>
        <title>Markdown-it editor demo</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link rel="shortcut icon" href="public/img/favicon/markdown.ico"/>
        <link rel="stylesheet" href="public/css/core.min.css" type="text/css"/>
        <script type="text/javascript" src="public/js/core.min.js"></script>

        <?php if (!$isProduction): ?>
            <link rel="stylesheet" href="build/css/style.css" type="text/css"/>
            <script type="text/javascript" src="app/js/script.js"></script>
            <script src="http://localhost:<?php echo getenv('LIVERELOAD_PORT'); ?>/livereload.js"></script>
        <?php endif; ?>
    </head>

    <body>
        <div class="container">
            <h1>markdown-it <small>demo</small></h1>
        </div>

        <div class="container full-height main">
            <div class="row full-height">
                <div class="col-xs-6 full-height source">
                    <!-- Nav tabs -->
                    <ul class="nav nav-tabs" role="tablist">
                        <li role="presentation" class="active">
                            <a href="#readme" aria-controls="readme" role="tab" data-toggle="tab">README.md</a>
                        </li>
                        <li role="presentation">
                            <a href="#sample" aria-controls="sample" role="tab" data-toggle="tab">Sample</a>
                        </li>
                    </ul>

                    <!-- Tab panes -->
                    <div class="tab-content full-height">
                        <div role="tabpanel" class="tab-pane active full-height" name="" id="readme">
                            <textarea class="readme full-height syncscroll" name="source"></textarea>
                        </div>
                        <div role="tabpanel" class="tab-pane full-height" id="sample">
                            <textarea class="sample full-height"></textarea>
                        </div>
                    </div>
                </div>

                <section class="col-xs-6 full-height">
                    <!-- Nav tabs -->
                    <ul class="nav nav-tabs demo-control" role="tablist">
                        <li role="presentation" class="active">
                            <a href="#html" aria-controls="html" role="tab" data-toggle="tab" data-result-as="html">html</a>
                        </li>
                        <li role="presentation">
                            <a href="#src" aria-controls="src" role="tab" data-toggle="tab" data-result-as="src">source</a>
                        </li>
                        <li role="presentation">
                            <a href="#debug" aria-controls="debug" role="tab" data-toggle="tab" data-result-as="debug">debug</a>
                        </li>
                    </ul>

                    <!-- Tab panes -->
                    <div class="tab-content result full-height">
                        <div role="tabpanel" class="tab-pane active result-html" id="html" name="source"></div>
                        <pre role="tabpanel" class="tab-pane result-src" id="src"><code class="result-src-content full-height"></code></pre>
                        <pre role="tabpanel" class="tab-pane result-debug" id="debug"><code class="result-debug-content full-height"></code></pre>
                    </div>
                </section>
            </div>
        </div>
    </body>
</html>
