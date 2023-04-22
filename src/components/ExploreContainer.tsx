import './ExploreContainer.css';

interface ContainerProps {
  name: string|undefined;
}


const ExploreContainer: React.FC<ContainerProps> = (props) => {
  return (
    <div className="container">
      <strong>{props.name}</strong>
      
    </div>
  );
};

export default ExploreContainer;
