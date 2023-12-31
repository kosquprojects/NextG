/*
 Multi Select jQuery Plugin - v1.0.0-beta1

 Copyright 2017 Ganpat S Rajpurohit, Jaipur.

 Licensed MIT
*/
"function" !== typeof Object.create && (Object.create = function (a) { function k() { } k.prototype = a; return new k });
(function (a, k, l, n) {
    a.strip_tags = function (a) { return (a || "").replace(/(<([^>]+)>)/ig, "") }; var m = {
        _init: function (b, d) {
            var c = this; this.settings = a.extend({}, a.fn.multi_select.defaults, d); this.$el = a(b); this.selectedValues = []; this.basicClass = "multi-button"; this.selectColors = "green blue aqua red yellow maroon purple".split(" "); var e = this.settings; a(b).each(function () {
                a(this).css({ position: "relative", width: e.buttonWidth }); $wrapper = c._styleElement(a(this)); $list = c._createList(a(this)); a(this).append($list);
                a(this).data("list", $list); c._addEvents(this); c._setSelected()
            })
        }, init: function () { this._init.call(this, this.$el, this.settings) }, _createList: function (b) {
            var d = this, c = d.settings, e = this.getData(), g = c.selectedIndexes; c = c.listMaxHeight; var h = {}; c && (h = { "overflow-x": "hidden", "overflow-y": "auto", display: "none", "max-height": c }); var f = a("<ul />", { "class": "multi-menu" }).css(h).data("trigger", b); b = a("<li />", { "class": "control" }); $selAllNone = a("<a />", { "class": "select-all-none", text: this.settings.selectAllText }).on("click",
                function (a) { a.preventDefault(); d._selectToggle(this) }); b.append($selAllNone); f.append(b); 0 < e.length && a.each(e, function (b, c) {
                    var e = ""; -1 !== a.inArray(c.index, g) && (e = "selected"); e = a("<li />", { "class": "list-items " + e, data: { id: c.index, text: a.strip_tags(c.text) } }); var h = a("<a />", {}), k = a("<span />", { "class": "text", html: a.strip_tags(c.text) }), l = a("<span />", { "class": "check-mark", html: "&#10004;" }); h.append(k).append(l); e.append(h).on("click", function () { a(this).toggleClass("selected"); d._setSelected(a(this)) });
                    f.append(e)
                }); return this.$list = f
        }, _addEvents: function (b) {
            var d = this; a(b); var c = d.settings, e = c.duration, g = c.easing; a(b).on("click", function (c) { c.preventDefault(); a(this); var f = a(b).find("ul"); a(b).hasClass("open") ? a(c.target).is(f) || a(c.target).is(a("*", f)) || ("slide" == g ? f.slideUp(e, function () { a(b).removeClass("open") }) : "fade" == g && f.fadeOut(e, function () { a(b).removeClass("open") })) : "slide" == g ? f.slideDown(e, function () { a(b).addClass("open") }) : "fade" == g && f.fadeIn(e, function () { a(b).addClass("open") }); d._hideList() });
            a(b).bind("gs.hidden", b, function (b, c) { a(this).hasClass("open") ? console.log("open") : console.log("not open") })
        }, _styleElement: function (b) { var d = this.settings, c = []; c.push(this.basicClass); c.push("button-" + d.selectSize); c.push("button-" + d.selectColor); d.fillButton && c.push("fill"); c = c.join(" "); d = a("<span />", { "class": "button-text", html: d.selectText }); b.addClass(c).html(d) }, getData: function () { var a = this.settings.sortByText ? this._sortByText() : this._sortByKey(); this.settings.data = a; return this.settings.data },
        _sortByText: function () { var b = []; a.each(this.settings.data, function (a, c) { b.push({ text: c, index: a }) }); b.sort(function (a, b) { return a.text > b.text ? 1 : a.text < b.text ? -1 : 0 }); return b }, _sortByKey: function () { var b = []; a.each(this.settings.data, function (a, c) { b.push({ text: c, index: a }) }); return b }, _checkSelected: function () { var a = this.$el, d = a.data("list"), c = d.find("li:not(.control)"); d = d.find("li.selected:not(.control)"); c.length == d.length ? a.find(".select-all-none").text(this.settings.selectNoneText) : a.find(".select-all-none").text(this.settings.selectAllText) },
        getSelectedValues: function () { return this.settings.selectedValues }, clearValues: function () { var a = this.$el; a.data("list").find("li.selected").removeClass("selected"); this.settings.selectedValues = []; a.find(".button-text").text(this.settings.selectText) }, _selectToggle: function (b) {
            var d = this.$el, c = this.settings, e = d.find(".button-text"); d = d.data("list"); var g = d.find("li:not(.control)"); b = a(b); if (this.settings.selectAllText == b.text()) {
                d.find("li:not(.control)").addClass("selected"); b.text(this.settings.selectNoneText); var h = [], f = []; 0 <
                    g.length ? (g.each(function (c, b) { h[c] = a(this).data("id"); f.push(a(this).data("text")) }), g.length <= c.selectedCount ? e.text(f.join(", ")) : e.text(this.settings.selectedText + " (" + g.length + ")")) : e.text(this.settings.selectText); this.settings.selectedValues = h; this.settings.onSelect.call(this, this.settings.selectedValues); this._checkSelected()
            } else this.clearValues(), b.text(this.settings.selectAllText), this.settings.onSelect.call(this, this.settings.selectedValues)
        }, _setSelected: function (b) {
            var d = this.$el; b = this.settings; var c = d.data("list").find("li.selected");
            d = d.find(".button-text"); var e = [], g = []; 0 < c.length ? (c.each(function (c, b) { g[c] = a(this).data("id"); e.push(a(this).data("text")) }), c.length <= b.selectedCount ? d.text(e.join(", ")) : d.text(this.settings.selectedText + " (" + c.length + ")")) : d.text(this.settings.selectText); this.settings.selectedValues = g; this.settings.onSelect.call(this, this.settings.selectedValues); this._checkSelected()
        }, _hideList: function () {
            var b = this.$el, d = this.settings, c = d.duration, e = d.easing; a(l).on("click", function (d) {
                b.each(function () {
                    var b = a(this).find(".multi-menu");
                    if (!a(this).is(d.target) && 0 === a(this).has(d.target).length && 0 === b.has(d.target).length) { var f = a(this); "slide" == e ? b.slideUp(c, function () { f.removeClass("open") }) : "fade" == e && b.fadeOut(c, function () { f.removeClass("open") }) }
                })
            })
        }
    }; a.fn.multi_select = function (b) { if (a.isPlainObject(b)) return this.each(function () { var c = Object.create(m); c._init(this, b); a(this).data("multi_select", c) }); if ("string" === typeof b && 0 !== b.indexOf("_")) { var d = a(this).data("multi_select"); return d[b].apply(d, a.makeArray(arguments).slice(1)) } };
    a.fn.multi_select.defaults = { selectColor: "red", selectSize: "small", selectText: "Select", selectAllText: "Select all", selectNoneText: "Select none", selectedText: "Selected", selectedCount: 3, duration: 300, easing: "slide", listMaxHeight: 200, selectedIndexes: null, sortByText: !1, fillButton: !1, data: {}, buttonWidth: "100%", onSelect: function () { return !0 } }
})(jQuery, window, document);

