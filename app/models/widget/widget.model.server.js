module.exports = function(applicationModel) {

    var Application = applicationModel.getMongooseModel();

    var api = {
        createWidget: createWidget,
        updateWidget: updateWidget,
        removeWidget: removeWidget,
        sortWidget  : sortWidget
    };
    return api;

    function sortWidget(applicationId, pageId, startIndex, endIndex) {
        return Application
            .findById(applicationId)
            .then(
                function(application) {
                    application.pages.id(pageId).widgets.splice(endIndex, 0, application.pages.id(pageId).widgets.splice(startIndex, 1)[0]);

                    // notify mongoose 'pages' field changed
                    application.markModified("pages");

                    application.save();
                }
            );
    }

    function removeWidget(applicationId, pageId, widgetId, newWidget) {
        return Application
            .findById(applicationId)
            .then(
                function(application) {
                    application.pages.id(pageId).widgets.remove(widgetId);
                    return application.save();
                }
            );
    }

    function updateWidget(applicationId, pageId, widgetId, newWidget) {
        delete newWidget._id;
        return Application
            .findById(applicationId)
            .then(
                function(application) {
                    var widget = application.pages.id(pageId).widgets.id(widgetId);
                    widget.name = newWidget.name;
                    widget.text = newWidget.text;
                    if(widget.widgetType === "HEADER") {
                        if(newWidget.header) {
                            widget.header.size = newWidget.header.size || 2;
                        }
                    } else if(widget.widgetType === "HTML") {
                        if(newWidget.html) {
                            widget.html = {
                                text: newWidget.html.text
                            };
                        }
                    } else if(widget.widgetType === "IMAGE") {
                        if(newWidget.image) {
                            widget.image = {
                                url   : newWidget.image.url,
                                width : newWidget.image.width
                            };
                        }
                    } else if(widget.widgetType === "YOUTUBE") {
                        if(newWidget.youTube) {
                            widget.youTube = {
                                url   : newWidget.youTube.url,
                                width : newWidget.youTube.width
                            };
                        }
                    } else if(widget.widgetType === "TEXT") {
                        if(newWidget.textInput) {
                            widget.textInput.placeholder = newWidget.textInput.placeholder;
                            widget.textInput.rows = newWidget.textInput.rows;
                            widget.textInput.formatted = newWidget.textInput.formatted;
                        }
                    } else if(widget.widgetType === "DATATABLE") {
                        widget.datatable = {};
                        // save datatable widget to database
                        if(newWidget.datatable.collection && newWidget.datatable.collection.name) {
                            widget.datatable.collectionName = newWidget.datatable.collection.name;
                        }
                        if(newWidget.datatable.fields) {
                            // split field names into array
                            if(typeof newWidget.datatable.fields === "string") {
                                widget.datatable.fields = newWidget.datatable.fields.split(",");
                            } else if(newWidget.datatable.fields.length > 0) {
                                if(newWidget.datatable.fields[0].indexOf(",") > -1) {
                                    widget.datatable.fields = newWidget.datatable.fields[0].split(",");
                                } else {
                                    widget.datatable.fields = newWidget.datatable.fields;
                                }
                            }
                        } else {
                            widget.datatable.fields = [];
                        }
                    } else if(widget.widgetType === "REPEATER") {

                        // save REPEATER widget to database
                        // same as DATATABLE with the added property 'template'
                        widget.repeater.template = newWidget.repeater.template;
                        if(newWidget.repeater.collection && newWidget.repeater.collection.name) {
                            widget.repeater.collectionName = newWidget.repeater.collection.name;
                        }
                        if(newWidget.repeater.fields) {
                            // split field names into array
                            if(typeof newWidget.repeater.fields === "string") {
                                widget.repeater.fields = newWidget.repeater.fields.split(",");
                            } else if(newWidget.repeater.fields.length > 0) {
                                if(newWidget.repeater.fields[0].indexOf(",") > -1) {
                                    widget.repeater.fields = newWidget.repeater.fields[0].split(",");
                                } else {
                                    widget.repeater.fields = newWidget.repeater.fields;
                                }
                            }
                        } else {
                            widget.repeater.fields = [];
                        }
                    } else if(widget.widgetType === "LINK") {
                        if(newWidget.link) {
                            widget.link = {
                                url    : newWidget.link.url,
                                target : newWidget.link.target
                            };
                        }
                    } else if(widget.widgetType === "BUTTON") {
                        if(newWidget.button) {
                            widget.button.style     = newWidget.button.style;
                            
                            // save database command for when button is clicked
                            widget.button.dbCommand = newWidget.button.dbCommand;
                            // save page id button navigates to
                            if(newWidget.button.navigate) {
                                widget.button.navigate = newWidget.button.navigate._id;
                            }
                        }
                    }
                    return application.save();
                }
            );
    }

    function createWidget(applicationId, pageId, widgetType) {
        return Application.findById(applicationId)
            .then(
                function(application) {

                    var widget = {
                        widgetType: widgetType
                    };

                    application.pages.id(pageId).widgets.push(widget);

                    return application.save();
                }
            );
    }
}