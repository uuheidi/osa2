const Header = ({name}) => <h1>{name}</h1>

  const Content = (props) => {
    return (
      <>
        {props.course.map(e => <Part key={e.id} part={e.name} exercises={e.exercises} />)}
      </>
    )
  }

  const Part = (props) => {
    return (
      <p>
      {props.part} {props.exercises}
      </p>
    )
    }

  const Total = (props) => {
    const totalExercises = props.course.reduce((s, p) => {
      return s + p.exercises
    }, 0)

    return (
        <p>
          <b>Total of {totalExercises} exercises</b>
        </p>
    )
  }

  const Course = (props) => {
    console.log(props)
    const mappi = props.course
    return(
    <>
            {mappi.map(e => 
            <div key={e.id}>
            <Header name={e.name} />
            <Content course={e.parts} />
            <Total course={e.parts} />
            </div>
            )}
    
    </>
    )
  }
export default Course