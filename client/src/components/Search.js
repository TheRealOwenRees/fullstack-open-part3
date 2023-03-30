const Search = ({ newFilter, setNewFilter }) => {
    return (
        <div>
            <h2>Phonebook</h2>
            filter shown with <input value={newFilter} onChange={(e) => setNewFilter(e.target.value)} />
        </div>
    )
}

export default Search