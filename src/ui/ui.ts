import { GUI } from 'lil-gui'

/**
 * UI Class Definition
 *  Wrapper over lil-gui with some additional boilerplate UI functionality/hooks for common functionality.
 */
 export default class UI {
    protected uiInstance : GUI;

    /**
     * Constructor for the UI class.
     */
    public constructor( ) {
        // Instantiate the lil-gui instance.
        this.uiInstance = new GUI( );
    }

    /**
     * Return the instance of a lil-gui GUI object.
     * @returns lil-gui UI object instance.
     */
    public getUI( ) : GUI {
        return this.uiInstance;
    }
}