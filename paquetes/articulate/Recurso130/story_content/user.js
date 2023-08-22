function ExecuteScript(strId) {
	switch (strId) {
		case "6kgt3SghT3E":
			Script1();
			break;
		case "6hq2ydU7ktl":
			Script2();
			break;
		case "5mUZTNGg8GY":
			Script3();
			break;
	}
}

function Script1() {
	var player = GetPlayer();
	var api = SCORM2004_GrabAPI();
	var dataVisible = true;// api.rol === 'Alumno';
	var raw = SCORM2004_GetDataChunk();
	var data = (raw && raw.substring(0, 1) == '{') ? JSON.parse(raw) : null;
	console.log('ARTICULATE: raw = ', raw);
	console.log('ARTICULATE: data = ', data);
	if (!data || !data.estado) {
		SCORM2004_ResetStatus();
		SCORM2004_SetDataChunk('');
		player.SetVar('completado', false);
	}
	if (data && data.estado == 'incompleto') {
		SCORM2004_ResetStatus();
		player.SetVar('completado', false);
	}
	if (data && data.estado == 'completo') {
		SCORM2004_SetPassed();
		dataVisible = true;
		player.SetVar('completado', true);
	}
	if (data && data.valores) {
		var valores = data.valores;
		var claves = Object.keys(valores);
		for (let i = 0; i < claves.length; i++) {
			var clave = claves[i];
			var valor = valores[clave];
			if (dataVisible) player.SetVar(clave, valor);
		}
	}
}

function Script2() {
	var player = GetPlayer();
	var valores = {
		resp_01: player.GetVar('resp_01'),
		resp_02: player.GetVar('resp_02'),
		resp_03: player.GetVar('resp_03'),
	};
	var json = { estado: 'incompleto', valores: valores };
	var salida = JSON.stringify(json);
	SCORM2004_SetDataChunk(salida);
	SCORM2004_ResetStatus();
	var commit = SCORM2004_CommitData();
	commit ? player.SetVar('completado', false) : console.log('ARTICULATE: No se pudo realizar el commit.');
}

function Script3() {
	var player = GetPlayer();
	var valores = {
		resp_01: player.GetVar('resp_01'),
		resp_02: player.GetVar('resp_02'),
		resp_03: player.GetVar('resp_03'),
	};
	var json = { estado: 'completo', valores: valores };
	var salida = JSON.stringify(json);
	SCORM2004_SetDataChunk(salida);
	SCORM2004_SetPassed();
	var commit = SCORM2004_CommitData();
	commit ? player.SetVar('completado', true) : console.log('ARTICULATE: No se pudo realizar el commit.');
}

