import praia_icon from "./imgs/icone_praia.png";
import neve_icon from "./imgs/icone_neve.png";
import urbano_icon from "./imgs/icone_urbano.png";
import exotico_icon from "./imgs/icone_exotico.png";
import resort_icon from "./imgs/icone_resort.png";
import parque_icon from "./imgs/icone_parque.png";
import aventura_icon from "./imgs/icone_aventura.png";
import viagem_icon from "./imgs/icone_viagem.png";

export const ICON_TYPES = [
    {
        id: 2,
        name: "praia",
        icon: praia_icon,
        color: '#FDB72E'
    },
    {
        id: 3,
        name: "neve",
        icon: neve_icon,
        color: '#B9D4E1'
    },
    {
        id: 4,
        name: "urbano",
        icon: urbano_icon,
        color: '#C37CB3'
    },
    {
        id: 5,
        name: "exótico",
        icon: exotico_icon,
        color: '#EF955D'
    },
    {
        id: 6,
        name: "resort",
        icon: resort_icon,
        color: '#F9B5B3'
    },
    {
        id: 7,
        name: "parque",
        icon: parque_icon,
        color: '#F15C42'
    },
    {
        id: 8,
        name: "aventura",
        icon: aventura_icon,
        color: '#538CAE'
    },
    {
        id: 116,
        name: "viagem virtual",
        icon: viagem_icon,
        color: '#80CAA7'
    },
];

export const getFooterColor = (check) => {
    let slug;
    switch (check) {
        case 'aventura':
            slug = '#538CAE';
            break;
        case 'exotico':
            slug = '#EF955D';
            break;
        case 'neve':
            slug = '#B9D4E1';
            break;
        case 'parque':
            slug = '#F15C42';
            break;
        case 'praia':
            slug = '#FDB72E';
            break;
        case 'resort':
            slug = '#F9B5B3';
            break;
        case 'urbano':
            slug = '#C37CB3';
            break;
        case 'viagem':
            slug = '#80CAA7';
            break;
        default:
            slug = '#000'
            break;
    }
    return slug
};