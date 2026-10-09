import React from 'react';

function TopHeader({userName}){
    return(
        <header className="top-header">
            <div className="logo">KP Art</div>
            <div className="welcome-msg">Welcome, {userName}!</div>
        </header>
    );

}
export default TopHeader;