export const Loading = () => {
    return (
        <div 
            className="loading-container" 
            style={{
                display: 'flex',
                justifyContent: 'center',  // מרכוס אופקי (ימין-שמאל)
                alignItems: 'center',      // מרכוס אנכי (למעלה-למטה)
                minHeight: '50vh',         // תופס חצי מגובה המסך (שיהיה בדיוק באמצע העמוד)
                width: '100%'              // תופס את כל רוחב העמוד בשביל המרכוס
            }}
        >
            <img 
                src='./Loading.gif' 
                alt="Loading..." 
                className="loading-gif"  
                style={{
                    width: '40px',         // גודל קטן מאוד ומדויק בפיקסלים
                    height: 'auto'
                }}
            />
        </div>
    );
};