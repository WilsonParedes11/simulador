import React, { useState, useEffect } from 'react';

const PreguntaCard = ({ pregunta, onNext, questionNumber, totalQuestions }) => {
  const [seleccionada, setSeleccionada] = useState(null);
  const [respondida, setRespondida] = useState(false);
  const [opcionesMezcladas, setOpcionesMezcladas] = useState([]);

  const getMateriaColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-800',
      red: 'bg-red-100 text-red-800',
      green: 'bg-green-100 text-green-800',
      purple: 'bg-purple-100 text-purple-800',
      orange: 'bg-orange-100 text-orange-800',
      cyan: 'bg-cyan-100 text-cyan-800',
      gray: 'bg-gray-100 text-gray-800'
    };
    return colorMap[color] || colorMap.gray;
  };

  // Función para mezclar las opciones aleatoriamente
  const mezclarOpciones = (opciones) => {
    const opcionesCopia = [...opciones];
    for (let i = opcionesCopia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opcionesCopia[i], opcionesCopia[j]] = [opcionesCopia[j], opcionesCopia[i]];
    }
    return opcionesCopia;
  };

  // Este useEffect se ejecuta cada vez que cambia la pregunta
  // y resetea el estado del componente y mezcla las opciones
  useEffect(() => {
    setSeleccionada(null);
    setRespondida(false);
    
    // Mezclar las opciones cada vez que cambia la pregunta
    if (pregunta && pregunta.opciones) {
      const opcionesMezcladasNuevas = mezclarOpciones(pregunta.opciones);
      setOpcionesMezcladas(opcionesMezcladasNuevas);
    }
  }, [pregunta, questionNumber]); // Resetea cuando cambia la pregunta

  const handleSeleccion = (opcion) => {
    if (!respondida) {
      setSeleccionada(opcion);
      setRespondida(true);
      
      // Opcional: llamar a una función callback para notificar la respuesta
      // if (onAnswer) {
      //   onAnswer(opcion);
      // }
    }
  };

  const remezclarOpciones = () => {
    if (!respondida && pregunta && pregunta.opciones) {
      const nuevasOpcionesMezcladas = mezclarOpciones(pregunta.opciones);
      setOpcionesMezcladas(nuevasOpcionesMezcladas);
    }
  };

  const getOptionClasses = (opcion) => {
    const isCorrect = opcion.es_correcta;
    const isSelected = seleccionada?.id === opcion.id;
    
    let baseClasses = `
      relative p-3 sm:p-4 mb-3 rounded-xl border-2 cursor-pointer transition-all duration-300 
      transform hover:-translate-y-1 hover:shadow-lg group overflow-hidden
    `;

    if (!respondida) {
      // Estado inicial - no respondida
      return baseClasses + ' bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50/50';
    }

    // Estados después de responder
    if (isSelected && isCorrect) {
      return baseClasses + ' bg-gradient-to-r from-green-50 to-green-100 border-green-400 shadow-green-200/50 cursor-default';
    } else if (isSelected && !isCorrect) {
      return baseClasses + ' bg-gradient-to-r from-red-50 to-red-100 border-red-400 shadow-red-200/50 cursor-default';
    } else if (isCorrect) {
      return baseClasses + ' bg-gradient-to-r from-green-50 to-green-100 border-green-300 shadow-green-100/30 cursor-default';
    } else {
      return baseClasses + ' bg-gray-50 border-gray-200 opacity-60 cursor-default';
    }
  };

  const getOptionIcon = (opcion) => {
    const isCorrect = opcion.es_correcta;
    const isSelected = seleccionada?.id === opcion.id;

    if (!respondida) return null;

    if (isSelected && isCorrect) {
      return (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    } else if (isSelected && !isCorrect) {
      return (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      );
    } else if (isCorrect) {
      return (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 bg-green-400 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    }
    return null;
  };

  const handleNext = () => {
    // Determinar si la respuesta seleccionada fue correcta
    const respuestaCorrecta = seleccionada?.es_correcta || false;
    
    // Resetear el estado antes de ir a la siguiente pregunta
    setSeleccionada(null);
    setRespondida(false);
    
    // Llamar a la función onNext pasando si la respuesta fue correcta
    if (onNext) {
      onNext(respuestaCorrecta);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header con progreso */}
      {questionNumber && totalQuestions && (
        <div className="mb-4 sm:mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-600">
              Pregunta {questionNumber} de {totalQuestions}
            </span>
            <span className="text-xs sm:text-sm text-gray-500">
              {Math.round((questionNumber / totalQuestions) * 100)}% completado
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Tarjeta principal */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header de la pregunta */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6 border-b border-gray-100">
          {pregunta.materia_origen && (
            <div className="mb-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getMateriaColorClasses(pregunta.materia_color)}`}>
                📚 {pregunta.materia_origen}
              </span>
            </div>
          )}
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 leading-relaxed">
            {pregunta.texto}
          </h2>
        </div>

        {/* Opciones */}
        <div className="p-4 sm:p-6">
          {/* Indicador y control de opciones mezcladas */}
          <div className="mb-4 flex items-center justify-between">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-600 border border-blue-200">
              🔀 Opciones mezcladas aleatoriamente
            </span>
            
            {!respondida && (
              <button
                onClick={remezclarOpciones}
                className="inline-flex items-center px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors duration-200"
                title="Volver a mezclar opciones"
              >
                🎲 Remezclar
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            {opcionesMezcladas.map((opcion, index) => (
              <div
                key={`${pregunta.id || questionNumber}-${opcion.id || index}`} // Key único para cada pregunta
                className={`${getOptionClasses(opcion)} animate-fadeIn`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleSeleccion(opcion)}
              >
                {/* Efecto de hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Contenido de la opción */}
                <div className="relative flex items-center">
                  {/* Letra de la opción */}
                  <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3 sm:mr-4 font-semibold text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors duration-200 text-xs sm:text-sm">
                    {String.fromCharCode(65 + index)}
                  </div>
                  
                  {/* Texto de la opción */}
                  <span className="text-gray-700 font-medium flex-1 pr-6 sm:pr-8 text-sm sm:text-base">
                    {opcion.texto}
                  </span>
                  
                  {/* Icono de estado */}
                  {getOptionIcon(opcion)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer con botón */}
        {respondida && (
          <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
              <div className="text-xs sm:text-sm text-gray-600">
                {seleccionada?.es_correcta ? (
                  <span className="flex items-center text-green-600">
                    <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ¡Respuesta correcta!
                  </span>
                ) : (
                  <span className="flex items-center text-red-600">
                    <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Respuesta incorrecta
                  </span>
                )}
              </div>
              
              <button
                className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                onClick={handleNext}
              >
                {questionNumber === totalQuestions ? 'Ver Resultados' : 'Siguiente Pregunta'}
                <svg className="inline-block w-3 h-3 sm:w-4 sm:h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Debug info - removido */}
    </div>
  );
};

export default PreguntaCard;