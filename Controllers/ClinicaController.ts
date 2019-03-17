import * as Clinica from "../Models/ClinicaModel";

module.exports = function(route: any) {
	route.post("/rules", (req, resp) => {
		Clinica.createRule(req.body)
			.then(function(data) {
				resp.status(200);
				resp.send({
					message: "Regra cadastrada com suceso",
					data: data
				});
			})
			.catch(function(err) {
				resp.status(401);
				resp.send({
					message: "Não foi possível cadastrar a regra",
					error: err
				});
			});
	});

	route.delete("/rules/:id", (req, resp) => {
		Clinica.deleteRules(req.params.id)
			.then(function() {
				resp.status(200);
				resp.send({
					message: "Regra removida com sucesso"
				});
			})
			.catch(function(err) {
				resp.status(401);
				resp.send({
					message: "Não foi possível remover a regra"
				});
			});
	});

	route.get("/rules", (req, resp) => {
		Clinica.listRules()
			.then(function(rules) {
				resp.status(200);
				resp.send(rules);
			})
			.catch(function(err) {
				resp.status(401);
				resp.send(err);
			});
	});

	route.get("/rules/:init/:end", (req, resp) => {
		Clinica.listFilterRules(req.params.init, req.params.end)
			.then(function(rules) {
				resp.status(200);
				resp.send(rules);
			})
			.catch(function(err) {
				resp.status(401);
				resp.send(err);
			});
	});
};
