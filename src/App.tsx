import React, { useState, useEffect } from 'react';
import './App.css';

interface Contact {
    name: string;
    phone: string;
    email: string;
}

function App(): JSX.Element {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [contactInput, setContactInput] = useState<Contact>({
        name: '',
        phone: '',
        email: ''
    });
    const [updateInput, setUpdateInput] = useState<Contact>({
        name: '',
        phone: '',
        email: ''
    });
    const [emailError, setEmailError] = useState<boolean>(false);

    useEffect(() => {
        const savedContacts = localStorage.getItem('contacts');
        if (savedContacts) {
            setContacts(JSON.parse(savedContacts));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }, [contacts]);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const addContact = () => {
        const { name, phone, email } = contactInput;

        if (name && validateEmail(email)) {
            const existingContact = contacts.find((contact) => contact.name === name);
            if (existingContact) {
                const updatedContact = {
                    ...existingContact,
                    email: email || existingContact.email
                };
                const updatedContacts = contacts.map((contact) =>
                    contact.name === name ? updatedContact : contact
                );
                setContacts(updatedContacts);
                console.log('Contact updated.');
            } else {
                const newContact: Contact = {
                    name,
                    phone,
                    email
                };
                setContacts([...contacts, newContact]);
                console.log('Contact added.');
            }
            setContactInput({
                name: '',
                phone: '',
                email: ''
            });
            setEmailError(false);
        } else {
            setEmailError(true);
            console.log('Invalid input. Contact not added.');
        }
    };

    const deleteContact = (name: string) => {
        const filteredContacts = contacts.filter((contact) => contact.name !== name);
        if (filteredContacts.length === contacts.length) {
            console.log('Contact not found.');
        } else {
            setContacts(filteredContacts);
            console.log('Contact deleted.');
        }
    };

    const updateContact = (name: string) => {
        const updatedContacts = contacts.map((contact) => {
            if (contact.name === name) {
                return { ...contact, ...updateInput };
            }
            return contact;
        });
        setContacts(updatedContacts);
        console.log('Contact updated.');
        setUpdateInput({
            name: '',
            phone: '',
            email: ''
        });
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        if (name === 'phone') {
            // Validate phone number: only allow numbers and +
            const isValidPhone = /^[0-9+]+$/.test(value);
            if (!isValidPhone && value !== '') {
                console.log('Invalid phone number.');
                return;
            }
        }

        setContactInput((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleUpdateInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        if (name === 'phone') {
            // Validate phone number: only allow numbers and +
            const isValidPhone = /^[0-9+]+$/.test(value);
            if (!isValidPhone && value !== '') {
                console.log('Invalid phone number.');
                return;
            }
        }

        setUpdateInput((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className="App">
            <h1>Phone Contact Manager</h1>
            <div className="contact-form">
                <input
                    type="text"
                    name="name"
                    placeholder="Contact Name"
                    value={contactInput.name}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={contactInput.phone}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="email"
                    placeholder="Email Address"
                    value={contactInput.email}
                    onChange={handleInputChange}
                    className={emailError ? 'error' : ''}
                />
                {emailError && <p className="error-text">Invalid email format.</p>}
                <button className="action-button" onClick={addContact}>
                    Add Contact
                </button>
            </div>
            {contacts.map((contact) => (
                <div className="contact" key={contact.name}>
                    <div className="contact-info">
                        <span>{contact.name} | </span>
                        <span>{contact.phone} | </span>
                        <span>{contact.email}</span>
                    </div>
                    <div className="contact-buttons">
                        <button className="action-button" onClick={() => deleteContact(contact.name)}>
                            Delete
                        </button>
                        <button className="action-button" onClick={() => setUpdateInput(contact)}>
                            Update
                        </button>
                    </div>

                    {updateInput.name === contact.name && (
                        <div className="update-contact">
                            <input
                                type="text"
                                name="name"
                                placeholder="New Name"
                                value={updateInput.name}
                                onChange={handleUpdateInputChange}
                            />
                            <input
                                type="text"
                                name="phone"
                                placeholder="New Phone Number"
                                value={updateInput.phone}
                                onChange={handleUpdateInputChange}
                            />
                            <input
                                type="text"
                                name="email"
                                placeholder="New Email Address"
                                value={updateInput.email}
                                onChange={handleUpdateInputChange}
                            />
                            <button className="action-button" onClick={() => updateContact(contact.name)}>
                                Save
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default App;
