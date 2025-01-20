import Utilizator from '../Entities/Utilizator.js';

async function createUtilizator(data) {
    return await Utilizator.create(data);
}

async function getUtilizatori() {
    return await Utilizator.findAll();
}

async function getUtilizatorById(id) {
    return await Utilizator.findByPk(id);
}

async function deleteUtilizator(id) {
    let object = await Utilizator.findByPk(id);
    if (!object) {
        console.log('X');
        return;
    }
    return await object.destroy();
}

async function updateUtilizator(id, data) {
    let object = await Utilizator.findByPk(id);
    if (!object) {
        console.log('X');
        return;
    }
    return await object.update(data);
}

async function getUtilizatorByEmail(email) {
    try {
        const utilizator = await Utilizator.findOne({
            where: { email: email },
        });
        return utilizator;
    } catch (err) {
        console.error('Eroare la găsirea utilizatorului:', err);
        throw err;
    }
}

export { createUtilizator, getUtilizatori, getUtilizatorById, deleteUtilizator, updateUtilizator, getUtilizatorByEmail };
