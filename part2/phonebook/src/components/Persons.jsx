const Persons = ({ persons, deletePerson }) => (
  <div>
    {persons.map(person =>
      <div key={person.id} className="person">
        {person.name} {person.number}
        <button onClick={() => deletePerson(person.id, person.name)}>
          delete
        </button>
      </div>
    )}
  </div>
)
export default Persons