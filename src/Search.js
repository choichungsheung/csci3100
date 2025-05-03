// import React from 'react';

// const Search = () => {
//     return (
//         <div className="search-bar">
//             <p>Search Component</p>
//         </div>
//     );
// };

// export default Search;

import React, { useState } from 'react';

const Search = () => {
    const [query, setQuery] = useState('');

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    return (
        <div>
            <input 
                className="search-bar"
                type="text" 
                placeholder="Search..." 
                value={query} 
                onChange={handleInputChange} 
            />
        </div>
    );
};

export default Search;
