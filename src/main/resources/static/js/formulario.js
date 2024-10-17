document.addEventListener("DOMContentLoaded", function () {
    const txtTitulo = document.getElementById("titulo");
    const txtDescription = document.getElementById("description");
    const txtLink = document.getElementById("link");
    const txtPrecio = document.getElementById("precio");
    const btnValidar = document.getElementById("btnValidar");
    const url = 'https://api.cloudinary.com/v1_1/dmyrbljhd/image/upload';
    const txtGenero = document.getElementById("exampleFormControlSelect1");

    function validarTitulo(titulo) {
        return titulo.trim().length >= 3;
    }

    function validarDescription(description) {
        return description.trim().length >= 5;
    }

    function validarLink(link) {
        return txtLink.files.length != 0;
    }

    function validarPrecio(precio) {
        return precio != '';
    }

    btnValidar.addEventListener("click", function (event) {
        event.preventDefault();

        const tituloEsValido = validarTitulo(txtTitulo.value);
        const descriptionEsValido = validarDescription(txtDescription.value);
        const linkEsValido = validarLink(txtLink.value);
        const precioEsValido = validarPrecio(txtPrecio.value);

        if (!tituloEsValido) {
            txtTitulo.style.border = 'solid red thin';
            Swal.fire({
                icon: 'error',
                title: 'Error en el título',
                text: 'El título debe tener al menos 3 caracteres',
            });
            return;
        }

        if (!descriptionEsValido) {
            txtDescription.style.border = 'solid red thin';
            Swal.fire({
                icon: 'error',
                title: 'Error en la descripción',
                text: 'La descripción debe tener al menos 5 caracteres.',
            });
            return;
        }

        if (!linkEsValido) {
            txtLink.style.border = 'solid red thin';
            Swal.fire({
                icon: 'error',
                title: 'Error al colocar una imagen',
                text: 'Sube una imagen válida',
            });
            return;
        }

        if (!precioEsValido) {
            txtPrecio.style.border = 'solid red thin';
            Swal.fire({
                icon: 'error',
                title: 'Error en el precio',
                text: 'Favor de ingresar un precio para el producto',
            });
            return;
        }

        // Si todo es válido, primero sube la imagen a Cloudinary
        const formData = new FormData();
        formData.append('file', txtLink.files[0]);
        formData.append('upload_preset', 'truefan');

        fetch(url, {
            method: "POST",
            body: formData,
        }).then((response) => {
            return response.text();
        }).then((data) => {
            const imagenUrl = JSON.parse(data).url;

            // Preparar datos para enviarlos a tu backend
            const producto = {
                nombre: txtTitulo.value,
                descripcion: txtDescription.value,
                imagen: imagenUrl,
                precio: txtPrecio.value,
                genero: txtGenero.value
            };

			console.log(JSON.stringify(producto))
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer: ${localStorage.getItem("token")}`);
            myHeaders.append("Content-Type", "application/json");

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(producto),
                redirect: "follow"
            };

            fetch("http://localhost:8080/truefan/productos/", requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    console.log(result);
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Producto agregado",
                        showConfirmButton: true,
                        timer: 1500
                    });

                    txtTitulo.value = "";
                    txtDescription.value = "";
                    txtLink.value = "";
                    txtPrecio.value = "";
                })
                .catch((error) => console.error('Error:', error));
        });
    });
});
