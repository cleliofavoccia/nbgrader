define([
    'jquery',
    'base/js/namespace',
    'base/js/dialog',
    'base/js/utils'

], function ($, Jupyter, dialog, utils) {
    "use strict";

    var nbgrader_version = "0.7.0.dev";

    var ajax = utils.ajax || $.ajax;
    // Notebook v4.3.1 enabled xsrf so use notebooks ajax that includes the
    // xsrf token in the header data

    var checkNbGraderVersion = function (callback) {
        var settings = {
            cache : false,
            type : "GET",
            dataType : "json",
            data : {
                version: nbgrader_version
            },
            success : function (response) {
                if (!response['success']) {
                    var body = $("<div/>").text(response['message']);
                    dialog.modal({
                        title: "Version Mismatch",
                        body: body,
                        buttons: { OK: { class : "btn-primary" } }
                    });
                } else {
                    callback();
                }
            },
            error : utils.log_ajax_error,
        };
        var url = utils.url_path_join(Jupyter.notebook.base_url, 'nbgrader_version');
        ajax(url, settings);
    };

    var add_button = function () {
        var maintoolbar = $("#maintoolbar-container");
        var btn_group = $("<div />").attr("class", "btn-group")
        var btn = $("<button />").attr("class", "btn btn-default submit").text("Soumettre");
        btn_group.append(btn)
        maintoolbar.append(btn_group);

        btn.click(function (e) {
                var settings = {
                    cache : false,
                    data : {
                        course_id: that.data.course_id,
                        assignment_id: that.data.assignment_id
                    },
                    type : "POST",
                    dataType : "json",
                    success : function (data, status, xhr) {
                        if (!data.success) {
                            that.submit_error(data);
                            button.text('Submit');
                            button.removeAttr('disabled');
                        } else {
                            that.on_refresh(data, status, xhr);
                        }
                    },
                    error : function (xhr, status, error) {
                        container.empty().text("Error submitting assignment.");
                        utils.log_ajax_error(xhr, status, error);
                    }
                };
                button.text('Submitting...');
                button.attr('disabled', 'disabled');
                var url = utils.url_path_join(
                    that.base_url,
                    'assignments',
                    'submit'
                );
                ajax(url, settings);
            });

            });
        });
    };

    var load_extension = function () {
        add_button();
        console.log('nbgrader extension for submitting notebooks loaded.');
    };

    return {
        'load_ipython_extension': load_extension
    };
});
