
import Notes from './Notes';

export const Home = (props) => {
  const {showAlert} = props;
  return (
    <div className="container my-4"> 
      <Notes showAlert={showAlert}/>
    </div>
  )
}


