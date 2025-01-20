import Student from '../Entities/Student.js';

async function createStudent(data) {
    return await Student.create(data);
}

async function getStudenti() {
    return await Student.findAll();
}

async function getStudentById(id) {
    return await Student.findByPk(id);
}

async function deleteStudent(id) {
    let object = await Student.findByPk(id);
    if (!object) {
        console.log('X');
        return;
    }
    return await object.destroy();
}

async function updateStudent(id, data) {
    let object = await Student.findByPk(id);
    if (!object) {
        console.log('X');
        return null;
    }
    return await object.update(data);
}

export { createStudent, getStudenti, getStudentById, deleteStudent, updateStudent };
