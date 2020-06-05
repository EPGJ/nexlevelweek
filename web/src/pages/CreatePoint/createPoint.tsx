import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import "./styles.css";
import logo from "../../assets/logo.svg";
import { FiArrowLeft } from "react-icons/fi";
import { LeafletMouseEvent } from "leaflet";
import { Map, TileLayer, Marker } from "react-leaflet";
import api from "../../services/api";
import axios from "axios";


interface Item {
    id: number;
    title: string;
    image_url: string;
}
interface IBGEUfResponse {
    sigla: string;
}
interface IBGECityResponse {
    nome: string;
}

const CreatePoint = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])
    const [ufs, setUfs] = useState<string[]>([])
    const [selectedUf, setSelectedUf] = useState<string>('0');
    const [selectedCity, setSelectedCity] = useState<string>('0');
    const [cities, setCities] = useState<string[]>([]);
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: ""
    })
    const history = useHistory()
    useEffect(() => {
        getItems();
        getUfs();
        getInitialPosition();
    }, []);

    useEffect(() => {
        getCities();
    }, [selectedUf]);

    const getInitialPosition = () => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords
            setInitialPosition([latitude, longitude])
        });
    }
    const getItems = () => {
        api.get("/items").then(response => {
            setItems(response.data.serializedItems)
        }).catch(err => console.log(err));
    }
    const getUfs = () => {
        axios.get<IBGEUfResponse[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados").then((response) => {
            const ufInicials = response.data.map(uf => uf.sigla);
            setUfs(ufInicials);
        }).catch(err => console.log(err));
    }
    const getCities = () => {
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
            const cityNames = response.data.map(city => city.nome);
            setCities(cityNames)
        }).catch(err => console.log(err));
    }
    const handleSelectUf = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedUf(e.target.value)
    }
    const handleSelectCity = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedCity(e.target.value)
    }
    const handleMapClick = (e: LeafletMouseEvent) => {
        setSelectedPosition([
            e.latlng.lat,
            e.latlng.lng
        ])
    }
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const { name, email, phone } = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;
        const data = {
            name,
            email,
            phone,
            uf,
            city,
            latitude,
            longitude,
            items
        };
        await api.post("/points", data)
        alert("Sucesso!")
        history.push("/")

    }
    const handleSelectItem = (id: number) => {
        const alreadySelected = selectedItems.findIndex(item => item === id);
        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id);
            setSelectedItems(filteredItems);
        }
        else {
            setSelectedItems([...selectedItems, id])
        }


    }

    return (
        <>
            <div id="page-create-point">
                <header>
                    <img src={logo} alt="Ecoleta" />
                    <Link to="/">
                        <FiArrowLeft />
                    Voltar para home
                </Link>
                </header>
                <form onSubmit={handleSubmit}>
                    <h1>Cadastro do <br />ponto de coleta</h1>
                    <fieldset>
                        <legend>
                            <h2>Dados</h2>
                        </legend>
                        <div className="field">
                            <label htmlFor="name">Nome da entidade</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field-group">

                            <div className="field">
                                <label htmlFor="email">E-mail</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="name">Telefone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    id="phone"
                                    onChange={handleInputChange}
                                />
                            </div>

                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>
                            <h2>Endereço</h2>
                            <span>Selecione o endereço no mapa </span>
                        </legend>
                        <Map onClick={handleMapClick} center={initialPosition} zoom={15}>
                            <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={selectedPosition} />
                        </Map>

                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="uf">Estado (UF)</label>
                                <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf} >
                                    <option value="0">
                                        Selecione um estado
                                    </option>
                                    {
                                        ufs.map(uf => (
                                            <option key={uf} value={uf}>
                                                {uf}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>



                            <div className="field">
                                <label htmlFor="city">Cidade</label>
                                <select name="city" value={selectedCity} onChange={handleSelectCity} id="city">
                                    <option value="0">
                                        Selecione uma cidade
                                    </option>
                                    {
                                        cities.map(city => (
                                            <option value={city} key={city}>
                                                {city}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>

                        </div>



                    </fieldset>

                    <fieldset>
                        <legend>
                            <h2>Items de coleta</h2>
                            <span>Selecione um ou mais itens abaixo</span>
                        </legend>
                        <ul className="items-grid">
                            {

                                items.map(item => (
                                    <li
                                        key={item.id}
                                        onClick={() => handleSelectItem(item.id)}
                                        className={selectedItems.includes(item.id) ? "selected" : ""}>
                                        <img src={item.image_url} alt={item.title} />
                                        <span>{item.title}</span>
                                    </li>
                                ))
                            }


                        </ul>

                    </fieldset>

                    <button type="submit">Cadastrar ponto de coleta</button>

                </form>

            </div>
        </>
    )
}
export default CreatePoint;