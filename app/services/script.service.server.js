module.exports = function (app, model) {

    app.post ("/api/application/:applicationId/page/:pageId/widget/:widgetId/script", saveScript);
    app.get  ("/api/application/:applicationId/page/:pageId/widget/:widgetId/script", findScript);
    app.post ("/api/application/:applicationId/page/:pageId/widget/:widgetId/script/statement/:statementType", addStatement);

    var scriptModel = model.scriptModel;

    // handle http request to add a new statement
    function addStatement(req, res) {
        scriptModel
            .addStatement(req.params)
            .then(
                function(script) {
                    res.json(script);
                },
                function(err) {
                    res.statusCode(400).send(err);
                }
            );
    }

    function findScript(req, res) {
        scriptModel
            .findScript(req.params)
            .then(
                function(script) {
                    res.json(script);
                },
                function(err) {
                    res.statusCode(400).send(err);
                }
            );
    }

    function saveScript(req, res) {

        // path parameters
        var applicationId = req.params.applicationId;
        var pageId        = req.params.pageId;
        var widgetId      = req.params.widgetId;

        // body data
        var script        = req.body;

        scriptModel
            .saveScript(req.params, script)
            .then(
                function() {
                    res.sendStatus(200);
                },
                function(err) {
                    res.statusCode(400).send(err);
                }
            );
    }
}