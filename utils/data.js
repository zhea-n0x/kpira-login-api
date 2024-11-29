const dataJurusan = require('../enums/jurusan');

const convertData = async (input) => {
    const {data} = input;

    const {jurusan, program_studi, angkatan} = await convertNim(data.identitas);

    const convertedData = {
        nama: data.nama,
        nim: data.identitas,
        role: data.role === 'mhs' ? 'Mahasiswa' : 'Civitas',
        status: data.status === 'L' ? 'Lulus' : 'Aktif',
        jurusan,
        program_studi,
        angkatan
    }

    return convertedData;
}

const convertNim = async (nim) => {
    const toBeSliced = nim.slice(0,5);

    const kodeJurusan = toBeSliced.slice(0,3)
    const angkatan = toBeSliced.slice(3,5);

    const jurusanProdi = dataJurusan.EnumProgramStudi[kodeJurusan];


    if(!jurusanProdi)
        return {
            error: "jurusan/prodi belum terdaftar"
        }

    return {
        jurusan: jurusanProdi.jurusan,
        program_studi: jurusanProdi.programStudi,
        angkatan: '20'+angkatan
    }
}


module.exports = {
    convertData
}