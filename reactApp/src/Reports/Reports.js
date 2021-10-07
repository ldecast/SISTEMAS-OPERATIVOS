import React, { Component } from "react";
import "./Reports.css";
import LatestNews from "./LatestNews";
import Bars from "./Bars";
import Pie from "./Pie";
import socket from "../socket";

class Reports extends Component {

    constructor() {
        super();
        this.state = {
            posts: [],
            noticias: "",
            hashtags: "",
            upvotes: "",
            downvotes: "",
            vs_upvotes: 0,
            vs_downvotes: 0,
            top_five: [],
            db: "1",
            fecha: this.getToday(),
            isLoaded: false
        }
    }

    getData(_db = this.state.db, _fecha = this.state.fecha) {
        this.setState({
            isLoaded: false
        });
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ db: _db, fecha: _fecha })
        };
        fetch(process.env.REACT_APP_API_URL_ADMIN, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log("retorno: ", data);
                this.setState({
                    posts: data.posts || [],
                    noticias: data.noticias || "",
                    hashtags: data.hashtags || [],
                    upvotes: data.upvotes || "",
                    downvotes: data.downvotes || "",
                    vs_upvotes: data.vs_upvotes || 0,
                    vs_downvotes: data.vs_downvotes || 0,
                    top_five: data.top_five || [],
                    db: _db,
                    fecha: _fecha,
                    isLoaded: true
                });
            });
    }

    componentDidMount() {
        this.getData();

        socket.on('post-added', (result) => {
            console.log("post-added!")
            this.getData();
        });
        socket.on('post-voted', (result) => {
            console.log("post-voted!")
            this.getData();
        });
        socket.on('disconnect', (reason) => {
            console.log('Socket disconnected because of ' + reason);
        });
    }

    changeDB(event) {
        this.getData(event.target.value)
    }

    changeDate(event) {
        this.getData(this.state.db, event.target.value)
    }

    getToday() {
        var curr = new Date();
        curr.setDate(curr.getDate());
        var date = curr.toISOString().substr(0, 10);
        return date;
    }

    render() {
        return (
            <div className="root__container">

                <div className="reports__header">
                    <h1>Reportes</h1>
                    <select defaultValue={'1'} onChange={(e) => { this.changeDB(e); }}>
                        <option value="1">MySQL</option>
                        <option value="2">Cosmos DB</option>
                    </select>
                </div>
                {
                    this.state.isLoaded
                        ?
                        <div className="reports__contairner">

                            <div className="cards__container">
                                <div className="report__card" id="card-1">
                                    <h2>NOTICIAS</h2>
                                    <p>{this.state.noticias}</p>
                                </div>
                                <div className="report__card" id="card-2">
                                    <h2>HASHTAGS</h2>
                                    <p>{this.state.hashtags}</p>
                                </div>
                                <div className="report__card" id="card-3">
                                    <h2>UPVOTES</h2>
                                    <p>{this.state.upvotes}</p>
                                </div>
                                <div className="report__card" id="card-4">
                                    <h2>DOWNVOTES</h2>
                                    <p>{this.state.downvotes}</p>
                                </div>
                            </div>

                            <div className="flex__container">

                                <div className="vrs__container">
                                    <div className="vrs__header">
                                        <h2>UPVOTES VS DOWNVOTES</h2>
                                        <span className="vrs__date">
                                            <input type="date" id="fecha" name="fecha" defaultValue={this.state.fecha} onChange={(e) => { this.changeDate(e); }} />
                                        </span>
                                    </div>
                                    <div className="vrs__chart">
                                        <Bars
                                            upvotes={this.state.vs_upvotes}
                                            downvotes={this.state.vs_downvotes}
                                        />
                                    </div>
                                </div>

                                <div className="top__container">
                                    <div className="top__header">
                                        <h2>TOP HASHTAGS</h2>
                                    </div>
                                    <div className="top__chart">
                                        <Pie
                                            top_five={this.state.top_five}
                                        />
                                    </div>
                                </div>

                            </div>

                            <div className="posts__container">
                                <h2>ENTRADAS RECIENTES</h2>
                                <div className="posts__header">
                                    <p id="user__header">Usuario</p>
                                    <p id="date__header">Fecha</p>
                                    <p id="text__header">Comentario</p>
                                    <p id="hashtags__header">Hashtags</p>
                                </div>
                                <div className="posts__chart">
                                    {
                                        this.state.posts.map((tw) => {
                                            return <LatestNews key={this.state.db + tw.id}
                                                username={tw.username}
                                                date={tw.fecha}
                                                text={tw.content}
                                                id={tw.id}
                                                hashtags={tw.hashtags}
                                                db={this.state.db}
                                            />
                                        })
                                    }
                                </div>
                            </div>

                        </div>
                        :
                        <div className="gif_reports">
                            <img src="https://quevedoes.files.wordpress.com/2019/08/img_8392.gif" id="loading_reports" alt="loading" />
                        </div>
                }
            </div>
        );
    }

}

export default Reports;