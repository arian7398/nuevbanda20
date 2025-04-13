
// ID de la hoja de cálculo de Google Sheets
const SPREADSHEET_ID = '1_XVtibBW9zQYOj3YCzToSxcP76Tvzg_kH6ZYsnhhvLQ';

// Función para mostrar la interfaz web
/* function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('Registro de Casos de Extorsión')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
} */

// Modificar la función doGet para incluir manejo de sesiones
function doGet(e) {
  // Verificar si existe un token de sesión
  const token = e.parameter.token;
  const sessionData = validarSesion(token);
  
  if (!sessionData && !e.parameter.login) {
    // No hay sesión válida, mostrar página de login
    return HtmlService.createTemplateFromFile('Login')
      .evaluate()
      .setTitle('Sistema de Registro - Login')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  
  // Hay una sesión válida, mostrar la aplicación
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Registro de Casos de Bandas criminales')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


// Variables para almacenar usuarios y credenciales
// NOTA: En un entorno de producción, considera usar PropertiesService para almacenar estas credenciales
const USUARIOS = [
  { username: 'admin', password: 'fecor2025', role: 'admin' },
  // Puedes agregar más usuarios aquí en el futuro
  { username: 'neyra7398', password: 'neyra7398', role: 'user' },
  //primera suipra
  { username: '1FPCECCO-E1', password: '123456', role: 'user' },
  { username: '1FPCECCO-E2', password: '123456', role: 'user' },
  { username: '1FPCECCO-E3', password: '123456', role: 'user' },
  { username: '1FPCECCO-E4', password: '123456', role: 'user' },
  //segunda supra
  { username: '2FPCECCO-E1', password: '456789', role: 'user' },
  { username: '2FPCECCO-E2', password: '456789', role: 'user' },
  { username: '2FPCECCO-E3', password: '456789', role: 'user' },
  { username: '2FPCECCO-E4', password: '456789', role: 'user' },
  //tercera supra
  { username: '3FPCECCO-E1', password: '987654', role: 'user' },
  { username: '3FPCECCO-E2', password: '987654', role: 'user' },
  { username: '3FPCECCO-E3', password: '987654', role: 'user' },
  { username: '3FPCECCO-E4', password: '987654', role: 'user' },
  //cuarta supra
  { username: '4FPCECCO-E1', password: '654321', role: 'user' },
  { username: '4FPCECCO-E2', password: '654321', role: 'user' },
  { username: '4FPCECCO-E3', password: '654321', role: 'user' },
  { username: '4FPCECCO-E4', password: '654321', role: 'user' },


];

// Función para verificar credenciales
function verificarCredenciales(username, password) {
  // Buscar el usuario
  const usuario = USUARIOS.find(u => u.username === username && u.password === password);
  
  if (usuario) {
    // Credenciales correctas
    // Crear una sesión
    const sessionToken = Utilities.getUuid();
    CacheService.getUserCache().put('session_' + sessionToken, JSON.stringify({
      username: usuario.username,
      role: usuario.role,
      timestamp: new Date().getTime()
    }), 21600); // 6 horas de sesión
    
    // Redirigir a la aplicación principal con el token
    return {
      success: true,
      url: ScriptApp.getService().getUrl() + '?token=' + sessionToken
    };
  } else {
    // Credenciales incorrectas
    return {
      success: false,
      message: 'Usuario o contraseña incorrectos'
    };
  }
}

// Función para validar una sesión
function validarSesion(token) {
  if (!token) return false;
  
  const sessionData = CacheService.getUserCache().get('session_' + token);
  if (!sessionData) return false;
  
  try {
    const session = JSON.parse(sessionData);
    const now = new Date().getTime();
    
    // Verificar si la sesión ha expirado (6 horas)
    if (now - session.timestamp > 21600000) {
      CacheService.getUserCache().remove('session_' + token);
      return false;
    }
    
    // Actualizar timestamp de la sesión
    session.timestamp = now;
    CacheService.getUserCache().put('session_' + token, JSON.stringify(session), 21600);
    
    return session;
  } catch (e) {
    Logger.log('Error al validar sesión: ' + e);
    return false;
  }
}



// Mejora en código.gs para la función cerrarSesion
function cerrarSesion(token) {
  try {
    Logger.log("Intentando cerrar sesión con token: " + token);
    
    if (token) {
      // Intentar eliminar la sesión
      CacheService.getUserCache().remove('session_' + token);
      Logger.log("Sesión eliminada correctamente");
    } else {
      Logger.log("No se proporcionó token para cerrar sesión");
    }
    
    return {success: true, message: "Sesión cerrada correctamente"};
  } catch (e) {
    Logger.log("Error al cerrar sesión: " + e.toString());
    return {success: false, message: e.toString()};
  }
}
// Función para agregar un nuevo usuario (solo admin puede hacerlo)
function agregarUsuario(sessionToken, nuevoUsuario) {
  const sessionData = validarSesion(sessionToken);
  
  // Verificar que sea admin
  if (!sessionData || sessionData.role !== 'admin') {
    return {
      success: false,
      message: 'No tienes permisos para agregar usuarios'
    };
  }cerrarSesion
  
  // Verificar que el usuario no exista ya
  if (USUARIOS.some(u => u.username === nuevoUsuario.username)) {
    return {
      success: false,
      message: 'El nombre de usuario ya existe'
    };
  }
  
  // En un entorno real, aquí guardaríamos en una base de datos o PropertiesService
  // Para esta implementación, simplemente notificamos que debería agregar el usuario al código
  Logger.log('Nuevo usuario a agregar en el código: ' + JSON.stringify(nuevoUsuario));
  
  return {
    success: true,
    message: 'Usuario creado exitosamente (nota: en implementación completa, deberías actualizar la lista USUARIOS en el código)'
  };
}

function guardarDatos(datos) {
  try {
    
    Logger.log("Datos recibidos en guardarDatos: " + JSON.stringify(datos));
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getActiveSheet();
    
    // Convertir datos complejos a cadenas para almacenamiento
    const agraviadosTexto = datos.agraviados ? 
      datos.agraviados.map(a => 
        `${a.nombre}`
      ).join('\n') : '';

    // Para tipo de empresa, incluir el nombre si existe
    let tipoEmpresaTexto = datos.tipoEmpresa || '';
    if (datos.tipoEmpresa && datos.nombreEmpresa) {
      tipoEmpresaTexto = `${datos.tipoEmpresa} (${datos.nombreEmpresa})`;
    }
    // Si hay múltiples empresas
    if (datos.empresas && Array.isArray(datos.empresas) && datos.empresas.length > 0) {
      tipoEmpresaTexto = datos.empresas.map(emp => 
        `${emp.tipo} (${emp.nombre})`
      ).join('\n');
    }

    // Validar longitud de sumillaHechos y observaciones
    if (datos.sumillaHechos && datos.sumillaHechos.length > 500) {
      datos.sumillaHechos = datos.sumillaHechos.substring(0, 500);
    }
    
    if (datos.observaciones && datos.observaciones.length > 500) {
      datos.observaciones = datos.observaciones.substring(0, 500);
    }

    const denunciadosTexto = datos.denunciadosAlias ? 
      datos.denunciadosAlias.map(d => d.nombre || d).join(', ') : '';
    
    const instrumentosTexto = Array.isArray(datos.instrumentosExtorsion) ? 
      datos.instrumentosExtorsion.join(', ') : '';
    
    const numerosTexto = Array.isArray(datos.numerosTelefonicos) ? 
      datos.numerosTelefonicos.join(', ') : '';
    
    const imeiTexto = Array.isArray(datos.imeisTelefonicos) ? 
      datos.imeisTelefonicos.join(', ') : '';
    
    const titularesTexto = Array.isArray(datos.titularesPago) ? 
      datos.titularesPago.join(', ') : '';

    // Extraer función y tipo de empresa para los nuevos campos
    const funcionEjerce = datos.funcionAgraviado || '';
    const tipoEmpresa = datos.tipoEmpresa || '';

    // Asegurarse de que datosInteresDenunciado se procesa correctamente en guardarDatos
    const datosInteresDenunciadoTexto = Array.isArray(datos.datosInteresDenunciado) ? 
      datos.datosInteresDenunciado.join(', ') : 
      (typeof datos.datosInteresDenunciado === 'string' ? 
        datos.datosInteresDenunciado : 
        JSON.stringify(datos.datosInteresDenunciado));


    // Definir cuentasPagoTexto aquí
    const cuentasPagoTexto = Array.isArray(datos.cuentasPago) ? 
      datos.cuentasPago.join('\n') : datos.cuentaPago || '';
    
    sheet.appendRow([
      datos.id,
      new Date(), 
      
      // Información General
      datos.fiscalia,
      datos.fiscalacargo,
      
      // Detalles del Caso
      datos.unidadInteligencia,
      datos.instructorCargo,
      datos.formaInicio,
      datos.carpetaFiscal,
      datos.fechaHecho,
      datos.fechaIngresoFiscal,
      
      // Información del Agraviado
      datos.tipoAgraviado,
      agraviadosTexto,
      datos.funcionAgraviado,
      tipoEmpresaTexto,  // Mejorado con el nombre de la empresa
      
      // Información del Denunciado
      datos.delitos,
      datos.lugarHechos,
      denunciadosTexto,
      //datos.datosInteresDenunciado
      datosInteresDenunciadoTexto,
      datos.nombreBandaCriminal,
      datos.cantidadMiembrosBanda,
      datos.modalidadViolencia,
      datos.modalidadAmenaza,
      datos.atentadosCometidos,
      
      // Instrumentos y Métodos de Extorsión
      instrumentosTexto,
      datos.formaPago,
      numerosTexto,
      imeiTexto,
      cuentasPagoTexto,
      titularesTexto,

      // Donde antes tenías datos.cuentaPago, ahora usa cuentasPagoTexto
      
      // Datos de Interés de Pagos
      datos.tipoPago,
      datos.montoSolicitado,
      datos.montoPagado,
      datos.numeroPagos,
      datos.tipoPagoOtros,
      
      // Sumilla y Observaciones
      datos.sumillaHechos,
      datos.observaciones
    ]);
    
    return {
      success: true,
      message: 'Registro guardado exitosamente',
      data: datos
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al guardar datos: ' + error.toString()
    };
  }
}

function actualizarRegistroEnSheet(datos) {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getActiveSheet();
    var data = sheet.getDataRange().getValues();
    
    // Convertir datos complejos a cadenas para almacenamiento
    const agraviadosTexto = datos.agraviados ? 
      datos.agraviados.map(a => 
        `${a.nombre} (Función: ${a.funcion || 'No especificada'}, Empresa: ${a.tipoEmpresa ? a.tipoEmpresa + ' - ' + a.empresa : 'No especificada'})`
      ).join('\n') : '';
    
    // Modificar esta parte en actualizarRegistroEnSheet
    const datosInteresDenunciadoTexto = Array.isArray(datos.datosInteresDenunciado) ? 
      datos.datosInteresDenunciado.join(', ') : 
      (typeof datos.datosInteresDenunciado === 'string' ? 
        datos.datosInteresDenunciado : 
        JSON.stringify(datos.datosInteresDenunciado));

    // Y luego en la actualización del registro
    sheet.getRange(filaEncontrada, 19).setValue(datosInteresDenunciadoTexto);
    
    const denunciadosTexto = datos.denunciadosAlias ? 
      datos.denunciadosAlias.map(d => d.nombre || d).join(', ') : '';
    
    const instrumentosTexto = Array.isArray(datos.instrumentosExtorsion) ? 
      datos.instrumentosExtorsion.join(', ') : '';
    
    const numerosTexto = Array.isArray(datos.numerosTelefonicos) ? 
      datos.numerosTelefonicos.join(', ') : '';
    
    const imeiTexto = Array.isArray(datos.imeisTelefonicos) ? 
      datos.imeisTelefonicos.join(', ') : '';
    
    const titularesTexto = Array.isArray(datos.titularesPago) ? 
      datos.titularesPago.join(', ') : '';

    // Extraer función y tipo de empresa para los nuevos campos
    const funcionEjerce = datos.funcionAgraviado || '';
    const tipoEmpresa = datos.tipoEmpresa || '';

    // Definir cuentasPagoTexto
    const cuentasPagoTexto = Array.isArray(datos.cuentasPago) ? 
    datos.cuentasPago.join('\n') : datos.cuentaPago || '';
    
    // Buscar la fila que contiene el ID
    let filaEncontrada = -1;
    for (var i = 0; i < data.length; i++) {
      if (data[i][0] === datos.id) {
        filaEncontrada = i + 1; // +1 porque las filas en Sheets empiezan en 1
        break;
      }
    }
    
    if (filaEncontrada > 0) {
      // Actualizar los valores en la fila encontrada
      sheet.getRange(filaEncontrada, 3).setValue(datos.fiscalia);
      sheet.getRange(filaEncontrada, 4).setValue(datos.fiscalacargo);
      sheet.getRange(filaEncontrada, 5).setValue(datos.unidadInteligencia);
      sheet.getRange(filaEncontrada, 6).setValue(datos.instructorCargo);
      sheet.getRange(filaEncontrada, 7).setValue(datos.formaInicio);
      sheet.getRange(filaEncontrada, 8).setValue(datos.carpetaFiscal);
      sheet.getRange(filaEncontrada, 9).setValue(datos.fechaHecho);
      sheet.getRange(filaEncontrada, 10).setValue(datos.fechaIngresoFiscal);
      sheet.getRange(filaEncontrada, 11).setValue(datos.tipoAgraviado);
      sheet.getRange(filaEncontrada, 12).setValue(agraviadosTexto);
      sheet.getRange(filaEncontrada, 13).setValue(datosInteresAgraviados);
      sheet.getRange(filaEncontrada, 14).setValue(funcionEjerce); // Nuevo campo
      sheet.getRange(filaEncontrada, 15).setValue(tipoEmpresa);   // Nuevo campo
      sheet.getRange(filaEncontrada, 16).setValue(datos.delitos);
      sheet.getRange(filaEncontrada, 17).setValue(datos.lugarHechos);
      sheet.getRange(filaEncontrada, 18).setValue(denunciadosTexto);
      sheet.getRange(filaEncontrada, 19).setValue(datos.datosInteresDenunciado);
      sheet.getRange(filaEncontrada, 20).setValue(datos.nombreBandaCriminal);
      sheet.getRange(filaEncontrada, 21).setValue(datos.cantidadMiembrosBanda);
      sheet.getRange(filaEncontrada, 22).setValue(datos.modalidadViolencia);
      sheet.getRange(filaEncontrada, 23).setValue(datos.modalidadAmenaza);
      sheet.getRange(filaEncontrada, 24).setValue(datos.atentadosCometidos);
      sheet.getRange(filaEncontrada, 25).setValue(instrumentosTexto);
      sheet.getRange(filaEncontrada, 26).setValue(datos.formaPago);
      sheet.getRange(filaEncontrada, 27).setValue(cuentasPagoTexto);
      sheet.getRange(filaEncontrada, 28).setValue(imeiTexto);
      sheet.getRange(filaEncontrada, 29).setValue(titularesTexto);
      sheet.getRange(filaEncontrada, 30).setValue(datos.tipoPago);
      sheet.getRange(filaEncontrada, 31).setValue(datos.montoSolicitado);
      sheet.getRange(filaEncontrada, 32).setValue(datos.montoPagado);
      sheet.getRange(filaEncontrada, 33).setValue(datos.numeroPagos);
      sheet.getRange(filaEncontrada, 34).setValue(datos.tipoPagoOtros);
      sheet.getRange(filaEncontrada, 35).setValue(datos.sumillaHechos);
      sheet.getRange(filaEncontrada, 36).setValue(datos.observaciones);

      return {
        success: true,
        message: 'Registro actualizado exitosamente en Google Sheets',
        data: datos
      };
    } else {
      // No se encontró el registro, guardar como nuevo
      return guardarDatos(datos);
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error al actualizar datos: ' + error.toString()
    };
  }
}

function inicializarSheet() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    Logger.log("Hoja de cálculo abierta correctamente: " + ss.getName());
    
    // Buscar específicamente la "Hoja 1" o usar la hoja activa como respaldo
    var sheet = ss.getSheetByName("Hoja 1") || ss.getActiveSheet();
    Logger.log("Usando hoja: " + sheet.getName());
    
    // Verificar el estado actual de la hoja
    var range = sheet.getDataRange();
    var numRows = range.getNumRows();
    var numCols = range.getNumColumns();
    Logger.log("Estado actual: " + numRows + " filas, " + numCols + " columnas");
    
    // Verificar si ya existen encabezados
    var primeraFila = (numRows > 0) ? sheet.getRange(1, 1, 1, 1).getValue() : "";
    var encabezadosExisten = (primeraFila === "ID");

    // Solo crear encabezados si no existen
    if (!encabezadosExisten) {
      Logger.log("No se encontraron encabezados, creándolos ahora");
      
      // Si hay datos pero no son encabezados, insertar una fila al inicio
      if (numRows > 0) {
        Logger.log("Insertando fila al inicio para encabezados");
        sheet.insertRowBefore(1);
      }
    }
    
    // Definir encabezados
    var encabezados = [
      'ID',
      'Fecha de Registro',
      
      // Información General
      'Fiscalía',
      'Fiscal a Cargo',
      
      // Detalles del Caso
      'Unidad de Inteligencia',
      'Instructor a Cargo',
      'Forma de Inicio de Investigación',
      'Carpeta Fiscal',
      'Fecha del Hecho',
      'Fecha Ingreso Carpeta Fiscal',
      
      // Información del Agraviado
      'Tipo de Agraviado',
      'Agraviados',
      'Función que Ejerce',  // Nuevo campo
      'Tipo de Empresa',     // Nuevo campo
      
      // Información del Denunciado
      'Delitos',
      'Lugar de los Hechos',
      'Denunciados',
      'Datos de Interés del Denunciado',
      'Nombre/Apodo Banda Criminal',
      'Cantidad de Miembros de Banda',
      'Modalidad de Violencia',
      'Modalidad de Amenaza',
      'Atentados Cometidos',
      
      // Instrumentos y Métodos de Extorsión
      'Instrumentos de Extorsión',
      'Forma de Pago',
      'Números Telefónicos',
      'IMEI de Teléfonos',
      'Cuenta de Pago',
      'Titulares de Pago',
      
      // Datos de Interés de Pagos
      'Tipo de Pago',
      'Monto Solicitado',
      'Monto Pagado',
      'Número de Pagos',
      'Otros Tipos de Pago',
      
      // Sumilla y Observaciones
      'Sumilla de Hechos',
      'Observaciones'
    ];
    
    // Establecer los valores de encabezado en la primera fila
    sheet.getRange(1, 1, 1, encabezados.length).setValues([encabezados]);
    
    // Dar formato a los encabezados
    sheet.getRange(1, 1, 1, encabezados.length)
        .setBackground("#f3f3f3")
        .setFontWeight("bold")
        .setHorizontalAlignment("center");
    
    // Congelar la primera fila para que siempre sea visible
    sheet.setFrozenRows(1);
    
    // Ajustar automáticamente el ancho de las columnas
    sheet.autoResizeColumns(1, encabezados.length);
    
    Logger.log("Encabezados creados con éxito");
    
    return {
      success: true,
      message: 'Hoja de cálculo inicializada correctamente'
    };
  } catch (error) {
    Logger.log("ERROR en inicializarSheet: " + error.toString());
    return {
      success: false,
      message: 'Error al inicializar la hoja de cálculo: ' + error.toString()
    };
  }
}

// Función adicional para forzar la creación de encabezados de manera más directa
function crearEncabezadosForzados() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName("Hoja 1") || ss.getActiveSheet();
    Logger.log("Forzando encabezados en hoja: " + sheet.getName());
    
    // Limpiar la primera fila o insertar una nueva
    if (sheet.getLastRow() > 0) {
      sheet.insertRowBefore(1);
    }
    
    // Lista de encabezados
    var encabezados = [
      'ID',
      'Fecha de Registro',
      'Fiscalía',
      'Fiscal a Cargo',
      'Unidad de Inteligencia',
      'Instructor a Cargo',
      'Forma de Inicio de Investigación',
      'Carpeta Fiscal',
      'Fecha del Hecho',
      'Fecha Ingreso Carpeta Fiscal',
      'Tipo de Agraviado',
      'Agraviados',
      'Función que Ejerce',  // Nuevo campo
      'Tipo de Empresa',     // Nuevo campo
      'Delitos',
      'Lugar de los Hechos',
      'Denunciados',
      'Datos de Interés del Denunciado',
      'Nombre/Apodo Banda Criminal',
      'Cantidad de Miembros de Banda',
      'Modalidad de Violencia',
      'Modalidad de Amenaza',
      'Atentados Cometidos',
      'Instrumentos de Extorsión',
      'Forma de Pago',
      'Números Telefónicos',
      'IMEI de Teléfonos',
      'Cuenta de Pago',
      'Titulares de Pago',
      'Tipo de Pago',
      'Monto Solicitado',
      'Monto Pagado',
      'Número de Pagos',
      'Otros Tipos de Pago',
      'Sumilla de Hechos',
      'Observaciones'
    ];
    
    // Colocar encabezados directamente, uno por uno
    for (var i = 0; i < encabezados.length; i++) {
      sheet.getRange(1, i+1).setValue(encabezados[i]);
    }
    
    // Dar formato
    sheet.getRange(1, 1, 1, encabezados.length)
      .setBackground("#f3f3f3")
      .setFontWeight("bold")
      .setHorizontalAlignment("center");
    
    // Congelar la primera fila
    sheet.setFrozenRows(1);
    
    Logger.log("Encabezados forzados creados con éxito");
    return "Encabezados creados con éxito";
  } catch (error) {
    Logger.log("ERROR en crearEncabezadosForzados: " + error.toString());
    return "Error: " + error.toString();
  }
}

function obtenerRegistros() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getActiveSheet();
    var data = sheet.getDataRange().getValues();
    
    Logger.log('Filas encontradas: ' + data.length);

    // Si solo hay encabezados o está vacía, devolver array vacío
    if (data.length <= 1) {
      return [];
    }

    // Obtener encabezados (primera fila)
    var headers = data[0];
    
    // Convertir datos a objetos
    var registros = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      
      // Procesar el campo de Tipo de Empresa para extraer tipo y nombre
      var tipoEmpresaTexto = row[14] || '';
      var empresas = [];
      
      if (tipoEmpresaTexto && typeof tipoEmpresaTexto === 'string') {
        // Dividir por saltos de línea si hay múltiples empresas
        var empresasTexto = tipoEmpresaTexto.split('\n');
        
        empresasTexto.forEach(function(empresaTexto) {
          // Intentar extraer el tipo y nombre si está en formato "Tipo (Nombre)"
          var match = empresaTexto.match(/^(.*?)\s*\((.*?)\)$/);
          if (match) {
            empresas.push({
              id: Utilities.getUuid(),
              tipo: match[1].trim(),
              nombre: match[2].trim()
            });
          } else {
            // Si no coincide el formato, guardar solo el tipo
            empresas.push({
              id: Utilities.getUuid(),
              tipo: empresaTexto.trim(),
              nombre: ''
            });
          }
        });
      }
      
      var registro = {
        id: row[0],
        fechaRegistro: row[1],
        
        // Información General
        fiscalia: row[2],
        fiscalacargo: row[3],
        
        // Detalles del Caso
        unidadInteligencia: row[4],
        instructorCargo: row[5],
        formaInicio: row[6],
        carpetaFiscal: row[7],
        fechaHecho: row[8],
        fechaIngresoFiscal: row[9],
        // Ya no incluimos fechadeingreso
        
        // Información del Agraviado
        tipoAgraviado: row[10],
        agraviados: (row[11] && typeof row[11] === 'string') ? 
          row[11].split('\n').map(function(nombre) {
            return {id: Utilities.getUuid(), nombre: nombre.trim()};
          }) : [],
        
        // Nuevos campos
        funcionAgraviado: row[12] || '',
        tipoEmpresa: tipoEmpresaTexto,
        empresas: empresas,

        cuentasPago: (row[27] && typeof row[27] === 'string') ? 
        row[27].split('\n').map(function(s) { return s.trim(); }) : [],
        
        // Información del Denunciado
        delitos: row[14],
        lugarHechos: row[15],
        denunciadosAlias: (row[16] && typeof row[16] === 'string') ? 
          row[16].split(', ').map(function(nombre) {
            return {id: Utilities.getUuid(), nombre: nombre.trim()};
          }) : [],
        
        // Modificar en obtenerRegistros, donde se crea cada registro
        datosInteresDenunciado: (() => {
          // Procesar datos de interés del denunciado (columna 17)
          if (!row[17]) return [];
          
          // Si es string, intentar separar por comas
          if (typeof row[17] === 'string') {
            return row[17].split(', ').map(item => item.trim()).filter(Boolean);
          }
          
          // Si ya es array, devolverlo directamente
          if (Array.isArray(row[17])) {
            return row[17];
          }
          
          // Si no se pudo procesar, devolver array vacío
          return [];
        })(),


        nombreBandaCriminal: row[18],
        cantidadMiembrosBanda: row[19],
        modalidadViolencia: row[20],
        modalidadAmenaza: row[21],
        atentadosCometidos: row[22],

        // Instrumentos y Métodos de Extorsión
        instrumentosExtorsion: (row[23] && typeof row[23] === 'string') ? 
          row[23].split(', ').map(function(s) { return s.trim(); }) : [],
        formaPago: row[24],
        numerosTelefonicos: (row[25] && typeof row[25] === 'string') ? 
          row[25].split(', ').map(function(s) { return s.trim(); }) : [],
        imeisTelefonicos: (row[26] && typeof row[26] === 'string') ? 
          row[26].split(', ').map(function(s) { return s.trim(); }) : [],
        cuentaPago: row[27],
        titularesPago: (row[28] && typeof row[28] === 'string') ? 
         row[28].split(', ').map(function(s) { return s.trim(); }) : [],
      
        // Datos de Interés de Pagos
        tipoPago: row[29],
        montoSolicitado: row[30],
        montoPagado: row[31],
        numeroPagos: row[32],
        tipoPagoOtros: row[33], 
        
        // Sumilla y Observaciones
        sumillaHechos: row[34],
        observaciones: row[35]
      };

      Logger.log('Registros procesados: ' + registros.length);
      registros.push(registro);
    }
    
    return registros;
  } catch (error) {
    Logger.log('Error en obtenerRegistros: ' + error);
    throw error;
  }
}


function eliminarRegistro(id) {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getActiveSheet();
    var data = sheet.getDataRange().getValues();
    
    // Buscar la fila que contiene el ID
    let filaEncontrada = -1;
    for (var i = 0; i < data.length; i++) {
      if (data[i][0] === id) {
        filaEncontrada = i + 1; // +1 porque las filas en Sheets empiezan en 1
        break;
      }
    }
    
    if (filaEncontrada > 0) {
      // Eliminar la fila
      sheet.deleteRow(filaEncontrada);
      
      return {
        success: true,
        message: 'Registro eliminado correctamente'
      };
    } else {
      return {
        success: false,
        message: 'No se encontró el registro para eliminar'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error al eliminar el registro: ' + error.toString()
    };
  }
}

/**
 * Exporta la hoja de cálculo directamente como PDF con orientación horizontal
 * y optimizada para mostrar todos los encabezados
 */
function exportarSheetAPDF() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getActiveSheet();
    
    // URL para exportar la hoja de cálculo como PDF con orientación horizontal
    var url = 'https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID + '/export?format=pdf' +
        '&portrait=false' +    // Orientación horizontal (landscape)
        '&scale=2' +           // Escala más pequeña para que quepa más contenido
        '&size=letter' +       // Tamaño carta
        '&fitw=true' +         // Ajustar al ancho
        '&top_margin=0.5' +    // Margen superior reducido
        '&bottom_margin=0.5' + // Margen inferior reducido
        '&left_margin=0.5' +   // Margen izquierdo reducido
        '&right_margin=0.5' +  // Margen derecho reducido
        '&gridlines=false' +   // Sin líneas de cuadrícula
        '&printtitle=true' +   // Imprimir el título
        '&sheetnames=true' +   // Mostrar nombres de hojas
        '&pagenum=CENTER' +    // Números de página centrados
        '&horizontalalignment=CENTER' + // Centrar horizontalmente
        '&fzr=false' +         // No congelar filas
        '&gid=' + sheet.getSheetId(); // ID de la hoja
    
    // Obtener el token de autorización
    var token = ScriptApp.getOAuthToken();
    
    // Obtener el PDF como blob
    var response = UrlFetchApp.fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    
    // Convertir a base64 para enviar al cliente
    var pdfContent = response.getContent();
    var base64PDF = Utilities.base64Encode(pdfContent);
    
    return {
      success: true,
      message: 'PDF generado exitosamente',
      url: 'data:application/pdf;base64,' + base64PDF,
      base64: base64PDF
    };
  } catch (error) {
    Logger.log("Error al exportar a PDF: " + error.toString());
    return {
      success: false,
      message: 'Error al generar PDF: ' + error.toString()
    };
  }
}

/* function exportarAExcel() {
  mostrarCargando();
  google.script.run
    .withSuccessHandler(function(result) {
      ocultarCargando();
      if (result.success) {
        descargarExcel(result);
      } else {
        mostrarAlerta('Error al generar Excel: ' + result.message, 'danger');
      }
    })
    .withFailureHandler(function(error) {
      ocultarCargando();
      mostrarAlerta('Error al exportar a Excel: ' + error, 'danger');
    })
    .exportarAExcel();
}

// Función auxiliar para descargar el Excel
function descargarExcel(result) {
  if (result.url && result.url.startsWith('data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,')) {
    const link = document.createElement('a');
    link.href = result.url;
    link.download = result.filename || 'Registro_Bandas_Criminales.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    mostrarAlerta('Excel generado exitosamente. La descarga comenzará automáticamente.', 'success');
  } else if (result.url) {
    window.open(result.url, '_blank');
    mostrarAlerta('Excel generado exitosamente', 'success');
  } else {
    mostrarAlerta('Error: No se pudo generar URL para el Excel', 'danger');
  }
}

// Añadir esta línea a la función document.addEventListener('DOMContentLoaded', function() { ... })
// dentro de la sección "Exportación a PDF"
const btnExportarExcel = document.getElementById('btnExportarExcel');
if (btnExportarExcel) {
  addSafeEventListener(btnExportarExcel, 'click', exportarAExcel);
} */

/**
 * Obtiene los registros directamente de la hoja de cálculo para el PDF
 */
function obtenerRegistrosParaPDF() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getActiveSheet();
    var data = sheet.getDataRange().getValues();
    
    // Si solo hay encabezados o está vacía, devolver array vacío
    if (data.length <= 1) {
      return [];
    }

    // Obtener encabezados (primera fila)
    var headers = data[0];
    
    // Función para convertir seguramente un valor a array usando split
    function safeStringSplit(value, separator) {
      if (!value) return [];
      if (typeof value === 'string') return value.split(separator);
      if (Array.isArray(value)) return value;
      return [String(value)]; // Convertir a string como fallback
    }
    
    // Convertir datos a objetos
    var registros = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      
      // Solo añadir registros que tengan al menos un ID
      if (row[0]) {
        var registro = {
          id: row[0],
          fechaRegistro: row[1],
          fiscalia: row[2],
          fiscalacargo: row[3],
          unidadInteligencia: row[4],
          instructorCargo: row[5],
          formaInicio: row[6],
          carpetaFiscal: row[7],
          fechaHecho: row[8],
          fechaIngresoFiscal: row[9],
          tipoAgraviado: row[10],
          agraviados: safeStringSplit(row[11], '\n'),
          funcionAgraviado: row[12],
          tipoEmpresa: row[13],
          delitos: row[14],
          lugarHechos: row[15],
          denunciadosAlias: safeStringSplit(row[16], '\n'),
          datosInteresDenunciado: row[17],
          nombreBandaCriminal: row[18],
          cantidadMiembrosBanda: row[19],
          modalidadViolencia: row[20],
          modalidadAmenaza: row[21],
          atentadosCometidos: row[22],
          instrumentosExtorsion: safeStringSplit(row[23], ', '),
          formaPago: row[24],
          numerosTelefonicos: safeStringSplit(row[25], ', '),
          imeisTelefonicos: safeStringSplit(row[26], ', '),
          cuentaPago: row[27],
          titularesPago: safeStringSplit(row[28], ', '),
          tipoPago: row[29],
          montoSolicitado: row[30],
          montoPagado: row[31],
          numeroPagos: row[32],
          tipoPagoOtros: row[33],
          sumillaHechos: row[34],
          observaciones: row[35]
        };
        
        registros.push(registro);
      }
    }
    
    return registros;
  } catch (error) {
    Logger.log("Error en obtenerRegistrosParaPDF: " + error.toString());
    throw error;
  }
}

/**
 * Crea un documento PDF con los registros y lo guarda en Google Drive
 */
function crearPDFConRegistros(registros) {
  try {
    // Función auxiliar para convertir varios tipos de datos a texto
    function safeToString(value) {
      if (!value) return "Ninguno";
      if (typeof value === 'string') return value;
      if (Array.isArray(value)) {
        if (value.length === 0) return "Ninguno";
        return value.map(item => {
          if (typeof item === 'object' && item !== null && item.nombre) {
            return item.nombre;
          }
          return String(item);
        }).join(", ");
      }
      return String(value);
    }
    
    // Crear un documento temporal
    const docTitle = "Registro de Casos de Extorsión - " + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm");
    const tempDoc = DocumentApp.create(docTitle);
    
    // Obtener el cuerpo del documento
    const body = tempDoc.getBody();
    
    // Añadir título y encabezado
    const header = body.appendParagraph("REGISTRO DE CASOS DE EXTORSIÓN");
    header.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    header.setFontFamily("Arial");
    header.setFontSize(16);
    header.setBold(true);
    
    const subheader = body.appendParagraph("Ministerio Público - Fiscalía Especializada");
    subheader.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    subheader.setFontFamily("Arial");
    subheader.setFontSize(12);
    subheader.setItalic(true);
    
    const fechaGen = body.appendParagraph("Fecha de generación: " + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss"));
    fechaGen.setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
    fechaGen.setFontFamily("Arial");
    fechaGen.setFontSize(10);
    
    body.appendParagraph("").appendHorizontalRule();
    
    // Agregar resumen
    const resumenTitulo = body.appendParagraph("RESUMEN DE REGISTROS");
    resumenTitulo.setFontFamily("Arial");
    resumenTitulo.setFontSize(14);
    resumenTitulo.setBold(true);
    
    const resumenTotal = body.appendParagraph("Total de registros: " + registros.length);
    resumenTotal.setFontFamily("Arial");
    resumenTotal.setFontSize(11);
    
    body.appendParagraph("").appendHorizontalRule();
    
    // Agregar cada registro en formato detallado
    registros.forEach(function(registro, index) {
      try {
        // Título del registro
        const casoTitulo = body.appendParagraph(`CASO #${index + 1}: ${registro.carpetaFiscal || "Sin Carpeta Fiscal"}`);
        casoTitulo.setFontFamily("Arial");
        casoTitulo.setFontSize(13);
        casoTitulo.setBold(true);
        casoTitulo.setBackgroundColor("#f0f0f0");
        
        // SECCIÓN: Información General
        const infoGeneralTitulo = body.appendParagraph("INFORMACIÓN GENERAL");
        infoGeneralTitulo.setFontFamily("Arial");
        infoGeneralTitulo.setFontSize(12);
        infoGeneralTitulo.setBold(true);
        
        // Crear una tabla para la información general con 2 columnas
        let table = body.appendTable();
        const infoGeneralData = [
          ["Fiscalía", registro.fiscalia || "No especificado"],
          ["Fiscal a Cargo", registro.fiscalacargo || "No especificado"],
          ["Unidad de Inteligencia", registro.unidadInteligencia || "No especificado"],
          ["Instructor a Cargo", registro.instructorCargo || "No especificado"]
        ];
        
        infoGeneralData.forEach(function(row) {
          let tableRow = table.appendTableRow();
          let cell1 = tableRow.appendTableCell(row[0]);
          cell1.setFontFamily("Arial").setFontSize(10).setBold(true).setWidth(150);
          let cell2 = tableRow.appendTableCell(row[1]);
          cell2.setFontFamily("Arial").setFontSize(10);
        });
        
        // SECCIÓN: Detalles del Caso
        const detallesTitulo = body.appendParagraph("\nDETALLES DEL CASO");
        detallesTitulo.setFontFamily("Arial");
        detallesTitulo.setFontSize(12);
        detallesTitulo.setBold(true);
        
        table = body.appendTable();
        const detallesCasoData = [
          ["Forma de Inicio", registro.formaInicio || "No especificado"],
          ["Carpeta Fiscal", registro.carpetaFiscal || "No especificado"],
          ["Fecha del Hecho", registro.fechaHecho || "No especificado"],
          ["Fecha Ingreso Carpeta", registro.fechaIngresoFiscal || "No especificado"]
        ];
        
        detallesCasoData.forEach(function(row) {
          let tableRow = table.appendTableRow();
          let cell1 = tableRow.appendTableCell(row[0]);
          cell1.setFontFamily("Arial").setFontSize(10).setBold(true).setWidth(150);
          let cell2 = tableRow.appendTableCell(row[1]);
          cell2.setFontFamily("Arial").setFontSize(10);
        });
        
        // SECCIÓN: Agraviado
        const agraviadoTitulo = body.appendParagraph("\nAGRAVIADO");
        agraviadoTitulo.setFontFamily("Arial");
        agraviadoTitulo.setFontSize(12);
        agraviadoTitulo.setBold(true);
        
        table = body.appendTable();
        
        // Tipo de Agraviado
        let tableRow = table.appendTableRow();
        let cell1 = tableRow.appendTableCell("Tipo de Agraviado");
        cell1.setFontFamily("Arial").setFontSize(10).setBold(true).setWidth(150);
        let cell2 = tableRow.appendTableCell(registro.tipoAgraviado || "No especificado");
        cell2.setFontFamily("Arial").setFontSize(10);
        
        // Agraviados
        tableRow = table.appendTableRow();
        cell1 = tableRow.appendTableCell("Agraviados");
        cell1.setFontFamily("Arial").setFontSize(10).setBold(true);
        
        const agraviadosTexto = safeToString(registro.agraviados);
        cell2 = tableRow.appendTableCell(agraviadosTexto);
        cell2.setFontFamily("Arial").setFontSize(10);
        
        // Función que ejerce y Tipo de empresa
        tableRow = table.appendTableRow();
        cell1 = tableRow.appendTableCell("Función que Ejerce");
        cell1.setFontFamily("Arial").setFontSize(10).setBold(true);
        cell2 = tableRow.appendTableCell(registro.funcionAgraviado || "No especificado");
        cell2.setFontFamily("Arial").setFontSize(10);
        
        tableRow = table.appendTableRow();
        cell1 = tableRow.appendTableCell("Tipo de Empresa");
        cell1.setFontFamily("Arial").setFontSize(10).setBold(true);
        cell2 = tableRow.appendTableCell(registro.tipoEmpresa || "No especificado");
        cell2.setFontFamily("Arial").setFontSize(10);
        
        // SECCIÓN: Denunciado
        const denunciadoTitulo = body.appendParagraph("\nDENUNCIADO");
        denunciadoTitulo.setFontFamily("Arial");
        denunciadoTitulo.setFontSize(12);
        denunciadoTitulo.setBold(true);
        
        table = body.appendTable();
        
        // Delitos
        tableRow = table.appendTableRow();
        cell1 = tableRow.appendTableCell("Delitos");
        cell1.setFontFamily("Arial").setFontSize(10).setBold(true).setWidth(150);
        cell2 = tableRow.appendTableCell(registro.delitos || "No especificado");
        cell2.setFontFamily("Arial").setFontSize(10);
        
        // Lugar de los Hechos
        tableRow = table.appendTableRow();
        cell1 = tableRow.appendTableCell("Lugar de los Hechos");
        cell1.setFontFamily("Arial").setFontSize(10).setBold(true);
        cell2 = tableRow.appendTableCell(registro.lugarHechos || "No especificado");
        cell2.setFontFamily("Arial").setFontSize(10);
        
        // Denunciados/Alias
        tableRow = table.appendTableRow();
        cell1 = tableRow.appendTableCell("Denunciados/Alias");
        cell1.setFontFamily("Arial").setFontSize(10).setBold(true);
        
        const denunciadosTexto = safeToString(registro.denunciadosAlias);
        cell2 = tableRow.appendTableCell(denunciadosTexto);
        cell2.setFontFamily("Arial").setFontSize(10);
        
        // Banda Criminal
        tableRow = table.appendTableRow();
        cell1 = tableRow.appendTableCell("Banda Criminal");
        cell1.setFontFamily("Arial").setFontSize(10).setBold(true);
        cell2 = tableRow.appendTableCell(registro.nombreBandaCriminal || "No especificado");
        cell2.setFontFamily("Arial").setFontSize(10);
        
        // SECCIÓN: Sumilla de Hechos
        if (registro.sumillaHechos) {
          const sumillaTitulo = body.appendParagraph("\nSUMILLA DE HECHOS");
          sumillaTitulo.setFontFamily("Arial");
          sumillaTitulo.setFontSize(12);
          sumillaTitulo.setBold(true);
          
          const sumilla = body.appendParagraph(registro.sumillaHechos);
          sumilla.setFontFamily("Arial");
          sumilla.setFontSize(10);
          sumilla.setIndent(10);
        }
        
        // SECCIÓN: Observaciones
        if (registro.observaciones) {
          const obsTitulo = body.appendParagraph("\nOBSERVACIONES");
          obsTitulo.setFontFamily("Arial");
          obsTitulo.setFontSize(12);
          obsTitulo.setBold(true);
          
          const obs = body.appendParagraph(registro.observaciones);
          obs.setFontFamily("Arial");
          obs.setFontSize(10);
          obs.setIndent(10);
        }
        
        // Separar cada registro
        if (index < registros.length - 1) {
          body.appendParagraph("")
              .appendPageBreak();
        }
      } catch (e) {
        // Si hay un error procesando un registro específico, lo registramos pero seguimos
        Logger.log("Error procesando registro #" + (index + 1) + ": " + e.toString());
        const errorMsg = body.appendParagraph("Error procesando este registro: " + e.toString());
        errorMsg.setFontFamily("Arial");
        errorMsg.setFontSize(10);
        errorMsg.setForegroundColor("#cc0000"); // Usar setForegroundColor en lugar de setColor
      }
    });
    
    // Guardar y cerrar el documento
    tempDoc.saveAndClose();
    
    // Convertir el documento a PDF
    const docBlob = DriveApp.getFileById(tempDoc.getId()).getAs('application/pdf');
    const pdfFile = DriveApp.createFile(docBlob);
    
    // Establecer un nombre descriptivo para el PDF
    pdfFile.setName("Registros de Casos de Extorsión - " + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd_HHmmss") + ".pdf");
    
    // Eliminar el documento temporal
    DriveApp.getFileById(tempDoc.getId()).setTrashed(true);
    
    return pdfFile;
  } catch (error) {
    Logger.log("Error en crearPDFConRegistros: " + error.toString());
    throw error;
  }
}

function getAgraviadosText(agraviados) {
  if (!agraviados || agraviados.length === 0) {
    return "Ninguno";
  }
  
  return agraviados.map(function(a) {
    return a.nombre || a;
  }).join(", ");
}

/**
 * Función auxiliar para formatear texto de denunciados
 */
function getDenunciadosText(denunciados) {
  if (!denunciados || denunciados.length === 0) {
    return "Ninguno";
  }
  
  return denunciados.map(function(d) {
    return d.nombre || d;
  }).join(", ");
}
