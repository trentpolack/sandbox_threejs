/*
 * platform.ts
 *  Minimal server for sandbox. Load http://127.0.0.1:7777 for testing.
*/ 

import express from "express"
import path from "path"
import http from "http"

const port: number = 7777

// Minimal server definition.
class Platform {
    private server: http.Server
    private port: number

    constructor( port: number ) {
        this.port = port
        const app = express()
        app.use( express.static( path.join( __dirname, '../client' ) ) )

        this.server = new http.Server( app );
    }

    public Start() {
        this.server.listen( this.port, () => {
            console.log( `Server listening on port ${ this.port }.` )
        } )
    }
}

new Platform( port ).Start()