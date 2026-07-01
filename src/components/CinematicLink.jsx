import { useCinematicTransition } from "../context/TransitionContext";

export default function CinematicLink({ to, children, className, onClick, ...props }) {
  const { startTransition } = useCinematicTransition();

  const handleClick = (e) => {
    e.preventDefault(); // Evitamos que el navegador haga el salto abrupto
    
    // Si pasaste una función onClick adicional, la ejecutamos
    if (onClick) onClick(e); 
    
    // Disparamos el motor cinematográfico
    startTransition(to);
  };

  return (
    <a href={to} onClick={handleClick} className={`cursor-pointer ${className}`} {...props}>
      {children}
    </a>
  );
}