import React from 'react';

const MateriaCard = ({ materia, onStart, icon, color = 'blue', questionCount }) => {
  const colorVariants = {
    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
    orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
    teal: 'from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700'
  };

  return (
    <div 
      className={`
        relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl 
        transform hover:scale-105 transition-all duration-300 ease-in-out
        bg-gradient-to-br ${colorVariants[color]} 
        cursor-pointer group min-h-[180px] flex flex-col justify-between
        border border-white/20
      `}
      onClick={onStart}
    >
      {/* Efecto de brillo */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      {/* Contenido */}
      <div className="relative z-10 p-6 text-white">
        {/* Icono */}
        {icon && (
          <div className="mb-4 flex justify-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm">
              {icon}
            </div>
          </div>
        )}
        
        {/* Título */}
        <h2 className="text-xl font-bold text-center mb-2 leading-tight">
          {materia}
        </h2>
        
        {/* Contador de preguntas */}
        {questionCount && (
          <p className="text-white/80 text-sm text-center">
            {questionCount} preguntas disponibles
          </p>
        )}
      </div>

      {/* Footer con botón de acción */}
      <div className="relative z-10 px-6 pb-6">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center group-hover:bg-white/30 transition-colors duration-200">
          <span className="text-white font-medium text-sm">Comenzar Simulacro</span>
        </div>
      </div>

      {/* Decoración de fondo */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
    </div>
  );
};

export default MateriaCard;