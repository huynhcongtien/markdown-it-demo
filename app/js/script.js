var mdHtml  = null,
    mdSrc   = null;

var defaults = {
    html: true,                 // Enable HTML tags in source
    xhtmlOut: false,            // Use '/' to close single tags (<br />)
    breaks: false,              // Convert '\n' in paragraphs into <br>
    langPrefix: 'language-',    // CSS language prefix for fenced blocks
    linkify: true,              // autoconvert URL-like texts to links
    typographer: true,          // Enable smartypants and other sweet transforms
    _view: 'html'               // html / src / debug
};

defaults.highlight = function (str, lang) {
    var esc = mdHtml.utils.escapeHtml;

    if (lang && hljs.getLanguage(lang)) {
        try {
            return '<pre class="hljs"><code class="' + lang + '">' +
                hljs.highlight(lang, str, true).value +
                '</code></pre>';
        } catch (__) {
        }
    }

    return '<pre class="hljs"><code>' + esc(str) + '</code></pre>';
};

function setResultView(val) {
    defaults._view = val;
}

function mdInit() {
    mdHtml = window.markdownit(defaults)
        .use(window.markdownitEmoji)
        .use(window.markdownitSub)
        .use(window.markdownitSup)
        .use(window.markdownitIns)
        .use(window.markdownitMark)
        .use(window.markdownitFootnote)
        .use(window.markdownitDeflist)
        .use(window.markdownitAbbr)
        .use(window.markdownitCentertext)
        .use(window.markdownitDisableAutoNotLink)
        ;

    mdSrc = window.markdownit(defaults)
        .use(window.markdownitEmoji)
        .use(window.markdownitSub)
        .use(window.markdownitSup)
        .use(window.markdownitIns)
        .use(window.markdownitMark)
        .use(window.markdownitFootnote)
        .use(window.markdownitDeflist)
        .use(window.markdownitAbbr)
        .use(window.markdownitCentertext)
        .use(window.markdownitDisableAutoNotLink)
        ;

    // Beautify output of parser for html content
    mdHtml.renderer.rules.table_open = function () {
        return '<table class="table table-striped">\n';
    };
    mdSrc.renderer.rules.table_open = function () {
        return '<table class="table table-striped">\n';
    };

    // Replace emoji codes with images
    mdHtml.renderer.rules.emoji = function(token, idx) {
        return window.twemoji.parse(token[idx].content);
    };

    // setting for container plugin
    var containerClass = ['success', 'warning', 'info', 'danger'];

    containerClass.forEach(function(className) {
        mdHtml.use(window.markdownitContainer, className);
        mdSrc.use(window.markdownitContainer, className);

        var tagOpen = 'container_' + className + '_open';
        var tagHtml = '<div class="alert alert-' + className + '">';

        mdHtml.renderer.rules[tagOpen] = function() {
            return tagHtml;
        };
        mdSrc.renderer.rules[tagOpen] = function() {
            return tagHtml;
        };
    });
}

function setHighlightedlContent(selector, content, lang) {
    if (window.hljs) {
        $(selector).html(window.hljs.highlight(lang, content).value);
    } else {
        $(selector).text(content);
    }
}

function updateResult() {
    var source = $('.source .active textarea').val();

    // Update only active view to avoid slowdowns
    // (debug & src view with highlighting are a bit slow)
    if (defaults._view === 'src') {
        setHighlightedlContent('.result-src-content', mdSrc.render(source), 'html');
    } else if (defaults._view === 'debug') {
        setHighlightedlContent(
            '.result-debug-content',
            JSON.stringify(mdSrc.parse(source, {references: {}}), null, 2),
            'json'
        );
    } else { /*defaults._view === 'html'*/
        $('.result-html').html(mdHtml.render(source));
    }
}

//////////////////////////////////////////////////////////////////////////////
// Init on page load
//
$(function() {
    'use strict';

    $.get('README.md', function(data) {
        //process text file line by line
        $('.readme').html(data.replace('n', ''));

        mdInit();
        updateResult();
    });

    $.get('sample.txt', function(data) {
        //process text file line by line
        $('.sample').html(data.replace('n', ''));

        updateResult();
    });

    // Setup listeners
    $('.source textarea').on('keyup paste cut mouseup', _.debounce(updateResult, 300, { maxWait: 500 }));

    var elScroll   = $('.readme, .sample, .result'),
        scrollTimer = 0;

    var syncScroll = function() {
        clearTimeout(scrollTimer);
        var el_others   = elScroll.not(this).off('scroll'),
            percentage  = this.scrollTop / (this.scrollHeight - this.offsetHeight);

        el_others.each(function() {
            var el_other = $(this);

            if (el_other.is(':visible')) {
                var other = el_other.get(0);

                other.scrollTop = percentage * (other.scrollHeight - other.offsetHeight);

                scrollTimer = setTimeout( function(){ elScroll.on('scroll', syncScroll); }, 150);
            }
        });
    };

    elScroll.on('scroll', syncScroll);

    $('.demo-control a').click(function(e) {
        e.preventDefault();

        var view = $(this).data('resultAs');

        if (view) {
            setResultView(view);
            updateResult();
        }
    });

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        updateResult();
    });

});
