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

// Modification du bouton 'Validate' en bouton 'Submit'. Lien vers le bouton 'Validate' original
// https://github.com/jupyter/nbgrader/blob/master/nbgrader/nbextensions/validate_assignment/main.js

// RIEN ICI

    var validate = function (data, button) {
        var body = $('<div/>').attr("id", "validation-message");
        if (data.success === true) {
            if (typeof(data.value) === "string") {
                data = JSON.parse(data.value);
            } else {
                data = data.value;
            }
            if (data.type_changed !== undefined) {
                for (var i=0; i<data.type_changed.length; i++) {
                    body.append($('<div/>').append($('<p/>').text('The following ' + data.type_changed[i].old_type + ' cell has changed to a ' + data.type_changed[i].new_type + ' cell, but it should not have!')));
                    body.append($('<pre/>').text(data.type_changed[i].source));
                }
                body.addClass("validation-type-changed");

            } else if (data.changed !== undefined) {
                for (var i=0; i<data.changed.length; i++) {
                    body.append($('<div/>').append($('<p/>').text('The source of the following cell has changed, but it should not have!')));
                    body.append($('<pre/>').text(data.changed[i].source));
                }
                body.addClass("validation-changed");

            } else if (data.passed !== undefined) {
                for (var i=0; i<data.changed.length; i++) {
                    body.append($('<div/>').append($('<p/>').text('The following cell passed:')));
                    body.append($('<pre/>').text(data.passed[i].source));
                }
                body.addClass("validation-passed");

            } else if (data.failed !== undefined) {
                for (var i=0; i<data.failed.length; i++) {
                    body.append($('<div/>').append($('<p/>').text('The following cell failed:')));
                    body.append($('<pre/>').text(data.failed[i].source));
                    body.append($('<pre/>').html(data.failed[i].error));
                }
                body.addClass("validation-failed");

            } else {
                body.append($('<div/>').append($('<p/>').text('Success! Your notebook passes all the tests.')));
                body.addClass("validation-success");
            }

        } else {
            body.append($('<div/>').append($('<p/>').text('There was an error running the validate command:')));
            body.append($('<pre/>').text(data.value));
        }

        dialog.modal({
            title: "Validation Results",
            body: body,
            buttons: { OK: { class : "btn-primary" } }
        });
    };

    var load_extension = function () {
        add_button();
        console.log('nbgrader extension for validating notebooks loaded.');
    };

    return {
        'load_ipython_extension': load_extension
    };
});
