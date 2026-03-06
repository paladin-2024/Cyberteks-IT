import React from 'react';

const SectionHeader = ({ eyebrow, title, description, align = 'left', className = '' }) => {
  const alignClass = align === 'center' ? 'text-center' : 'text-left';

  return (
    <div className={`${alignClass} ${className}`.trim()} data-reveal>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-[2.05rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-base text-slate-700">{description}</p>
      ) : null}
    </div>
  );
};

export default SectionHeader;
