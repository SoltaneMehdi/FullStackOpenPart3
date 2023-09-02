import { useEffect, useState } from "react";
import personService from "./services/persons";

const Notification = ({ message }) => {
    if (message === null) {
        return null;
    }

    return <div className="notification">{message}</div>;
};
const Error = ({ message }) => {
    if (message === null) {
        return null;
    }

    return <div className="error">{message}</div>;
};

const Filter = ({ searchTerm, handler }) => {
    return (
        <div>
            filter shown with <input value={searchTerm} onChange={handler} />
        </div>
    );
};

const PersonForm = ({ name, number, handleSubmit }) => {
    return (
        <form>
            <div>
                name: <input value={name.value} onChange={name.handler} />
            </div>
            <div>
                number: <input value={number.value} onChange={number.handler} />
            </div>
            <div>
                <button onClick={handleSubmit}>add</button>
            </div>
        </form>
    );
};

const Persons = ({ persons, searchTerm, handleRemove }) => {
    return (
        <div>
            {persons
                .filter((person) =>
                    person.name
                        .toLowerCase()
                        .startsWith(searchTerm.toLowerCase())
                )
                .map((person) => (
                    <p key={person.id}>
                        {person.name} {person.number}
                        <button
                            onClick={() => {
                                handleRemove(person);
                            }}
                        >
                            delete
                        </button>
                    </p>
                ))}
        </div>
    );
};

const App = () => {
    const [persons, setPersons] = useState([]);

    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [notifMessage, setNotifMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        personService
            .getAll()
            .then((initialPersons) => setPersons(initialPersons))
            .catch((error) => alert(error));
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        //seeing if the name is already reserved by an existing person
        let existingPerson = null;
        persons.forEach((person) => {
            if (person.name === newName) {
                existingPerson = person;
            }
        });

        if (existingPerson) {
            if (
                window.confirm(
                    `${existingPerson.name} is already added to phonebook, replace the number?`
                )
            ) {
                const newPerson = { ...existingPerson, number: newNumber };
                personService
                    .update(existingPerson.id, newPerson)
                    .then((returnedPerson) => {
                        setPersons(
                            persons.map((person) =>
                                person.id !== returnedPerson.id
                                    ? person
                                    : returnedPerson
                            )
                        );

                        setErrorMessage(
                            `${returnedPerson.name} has been updated!`
                        );
                        setTimeout(() => {
                            setErrorMessage(null);
                        }, 5000);
                    })
                    .catch((error) => {
                        setErrorMessage(error.response.data.message);
                        setTimeout(() => {
                            setErrorMessage(null);
                        }, 5000);
                    });
            }
        } else {
            const newPerson = { name: newName, number: newNumber };
            personService
                .create(newPerson)
                .then((result) => {
                    setPersons(persons.concat(result));
                    setNotifMessage(`${result.name} has been added!`);
                    setTimeout(() => {
                        setNotifMessage(null);
                    }, 5000);
                })
                .catch((error) => {
                    console.log(error);
                    setErrorMessage(error.response.data.message);
                    setTimeout(() => {
                        setErrorMessage(null);
                    }, 5000);
                });

            setNewName("");
            setNewNumber("");
        }
    };

    const handleRemove = (personToRemove) => {
        if (window.confirm(`delete ${personToRemove.name}`)) {
            personService
                .remove(personToRemove.id)
                .then(
                    setPersons(
                        persons.filter(
                            (person) => person.id !== personToRemove.id
                        )
                    )
                )
                .catch((error) => alert(error));
        }
    };

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={notifMessage} />
            <Error message={errorMessage} style={{ color: "red" }} />
            <Filter
                searchTerm={searchTerm}
                handler={(event) => setSearchTerm(event.target.value)}
            />
            <h2>add a new</h2>
            <PersonForm
                name={{
                    value: newName,
                    handler: (event) => setNewName(event.target.value),
                }}
                number={{
                    value: newNumber,
                    handler: (event) => setNewNumber(event.target.value),
                }}
                handleSubmit={handleSubmit}
            />
            <h2>Numbers</h2>
            <Persons
                persons={persons}
                searchTerm={searchTerm}
                handleRemove={handleRemove}
            />
        </div>
    );
};

export default App;
