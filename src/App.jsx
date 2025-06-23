import React, { useEffect, useState } from 'react';
import MateriaCard from './components/MateriaCard';
import PreguntaCard from './components/PreguntaCard';

function App() {
  const [materiasDisponibles, setMateriasDisponibles] = useState([]);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);
  const [datos, setDatos] = useState(null);
  const [iniciado, setIniciado] = useState(false);
  const [actual, setActual] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [completado, setCompletado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/cuestionarios.json')
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar las materias');
        return res.json();
      })
      .then(data => {
        setMateriasDisponibles(data.materias_disponibles);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar materias:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const seleccionarMateria = async (materia) => {
    setLoading(true);
    try {
      const response = await fetch(`/${materia.archivo}`);
      if (!response.ok) throw new Error(`Error al cargar ${materia.nombre}`);
      const data = await response.json();
      setDatos(data);
      setMateriaSeleccionada(materia);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const volverAMaterias = () => {
    setMateriaSeleccionada(null);
    setDatos(null);
    setIniciado(false);
    setActual(0);
    setPuntaje(0);
    setCompletado(false);
  };

  const iniciar = () => {
    setIniciado(true);
    setActual(0);
    setPuntaje(0);
    setCompletado(false);
  };

  const siguiente = (respuestaCorrecta) => {
    // Actualizar puntaje si la respuesta fue correcta
    if (respuestaCorrecta) {
      setPuntaje(prev => prev + 1);
    }
    
    if (actual < datos.preguntas.length - 1) {
      setActual(prev => prev + 1);
    } else {
      setCompletado(true);
    }
  };

  const reiniciar = () => {
    setIniciado(false);
    setActual(0);
    setPuntaje(0);
    setCompletado(false);
  };

  const calcularPorcentaje = () => {
    return Math.round((puntaje / datos.preguntas.length) * 100);
  };

  const getResultadoColor = () => {
    const porcentaje = calcularPorcentaje();
    if (porcentaje >= 80) return 'text-green-600';
    if (porcentaje >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getResultadoMensaje = () => {
    const porcentaje = calcularPorcentaje();
    if (porcentaje >= 80) return '¡Excelente trabajo! 🎉';
    if (porcentaje >= 60) return '¡Buen trabajo! 👍';
    return 'Puedes mejorar 💪';
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Cargando cuestionario...</p>
          <p className="text-gray-500 mt-2">Preparando tu simulacro</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error al cargar</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Pantalla de selección de materias
  if (!materiaSeleccionada && materiasDisponibles.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <header className="w-full bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Simulador de Derecho
                  </h1>
                  <p className="text-gray-600 mt-1">Sistema de práctica interactivo</p>
                </div>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Selecciona la materia que deseas practicar y pon a prueba tus conocimientos
              </p>
            </div>
          </div>
        </header>

        <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {materiasDisponibles.map((materia) => (
                <MateriaCard
                  key={materia.id}
                  materia={materia.nombre}
                  onStart={() => seleccionarMateria(materia)}
                  icon={materia.icon}
                  color={materia.color}
                  questionCount={materia.total_preguntas}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!datos) return null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20 sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={volverAMaterias}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              ← Todas las materias
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">{materiaSeleccionada?.icon}</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {datos.materia.nombre}
                </h1>
                <p className="text-sm text-gray-500">Sistema de práctica interactivo</p>
              </div>
            </div>
            
            {iniciado && (
              <button
                onClick={reiniciar}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Reiniciar
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Resto del contenido igual que antes... */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {!iniciado ? (
          <div className="w-full max-w-7xl mx-auto text-center">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                ¡Bienvenido al Simulacro de {datos.materia.nombre}!
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                {materiaSeleccionada?.descripcion || 'Pon a prueba tus conocimientos con nuestro simulador interactivo.'}
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Preguntas Variadas</h3>
                <p className="text-sm text-gray-600">{datos.preguntas.length} preguntas cuidadosamente seleccionadas</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Retroalimentación Inmediata</h3>
                <p className="text-sm text-gray-600">Conoce las respuestas correctas al instante</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Seguimiento de Progreso</h3>
                <p className="text-sm text-gray-600">Monitorea tu avance en tiempo real</p>
              </div>
            </div>

            <div className="max-w-md mx-auto">
              <MateriaCard 
                materia={datos.materia.nombre}
                onStart={iniciar}
                icon={materiaSeleccionada?.icon || "🎯"}
                color={materiaSeleccionada?.color || "blue"}
                questionCount={datos.preguntas.length}
              />
            </div>
          </div>
        ) : completado ? (
          // Pantalla de resultados (igual que antes)...
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold mb-2">¡Simulacro Completado!</h2>
                <p className="text-blue-100">{getResultadoMensaje()}</p>
              </div>
              
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className={`text-6xl font-bold mb-2 ${getResultadoColor()}`}>
                    {calcularPorcentaje()}%
                  </div>
                  <p className="text-gray-600 text-lg">
                    {puntaje} de {datos.preguntas.length} respuestas correctas
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Resumen de tu desempeño:</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{puntaje}</div>
                      <div className="text-sm text-gray-600">Correctas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{datos.preguntas.length - puntaje}</div>
                      <div className="text-sm text-gray-600">Incorrectas</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={iniciar}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    Intentar Nuevamente
                  </button>
                  <button
                    onClick={volverAMaterias}
                    className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Cambiar Materia
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <PreguntaCard
              pregunta={datos.preguntas[actual]}
              onNext={siguiente}
              questionNumber={actual + 1}
              totalQuestions={datos.preguntas.length}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;