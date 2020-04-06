let DC = {
	ip: "162.223.31.2",
    host: "dragoncourt.therealmsbeyond.com",
    port: 33030,
    modalCall: (url, params) => {
        Ajax.call(url, params, (obj) => {
            var template = Handlebars.compile(obj.html);
            var html = template(obj.data);
            DC.modal(obj.id, html, {});
        });
    },
    ajaxCall: (url, params, cb) => {
		Ajax.call(url, params, (obj) => {
			cb(obj);
		});
    },
    templateCall: (url, params, cb) => {
        Ajax.call(url, params, (obj) => {
            var template = Handlebars.compile(obj.html);
            var html = template(obj.data);
            cb(html, obj.data);
        });
    },
    modal: (id, html, opts) => {
        opts.fadeDuration = 500;
        $("<div id='"+id+"' class='modal'>"+html+"</div>").modal(opts);
    }
};