import React from 'react';
import Search from './Search';
import ViewSelect from './ViewSelect';



const Main = () => {
    return (
        <div style={{ height: '100vh' }}>
            <div className="container" style={{ height: '100%' }}>
                <div className="row" style={{ height: '100%' }}>
                    <div className="col-3 p-0" style={{ height: '100%' }}>
                    
                        <Search />
                    </div>
                    <div className="col p-0" style={{ height: '100%' }}>
                        <ViewSelect />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;