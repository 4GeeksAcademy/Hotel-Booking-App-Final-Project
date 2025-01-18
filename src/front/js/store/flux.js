const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			user_session: "",
			user_type: "",
			user_fName: "",
			hotels: [],
			name: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},
			loginAccount: async (username, password) => {
				try {
					// fetching data from the backend
					const response = await fetch(process.env.BACKEND_URL + "api/login", {
						method: "POST",
						headers: {
							"Content-type": "application/json"
						},
						body: JSON.stringify({
							username: username,
							password: password
						})
					})

					// if (!response.ok){
					// 	const errorMsg = await response.json()
					//  	throw new Error(errorMsg.msg)
					// }

					const data = await response.json()
					console.log(data)

					await setStore({ user_session: data.access_token })
					await setStore({ user_type: data.user_type })
					await setStore({ user_fName: data.fname})
					
					//Seteo de los datos necesarios del usuario
					localStorage.setItem("user_session", data.access_token)
					localStorage.setItem("user_type", data.user_type)
					localStorage.setItem("user_fName", data.fname)
					localStorage.setItem("username", data.username)

					return data;

				} catch (error) {
					console.log("Error loading message from backend", error)
					return error
				}
			},

			signUp: async (name, last_name, email, username, password, user_type) => {
				console.log(name, last_name, email, username, password, user_type);

				try {
					const response = await fetch(process.env.BACKEND_URL + "api/signup", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							name: name,
							last_name: last_name,
							email: email,
							username: username,
							password: password,
							user_type: user_type // Puede ser 'cliente' o 'hotel'
						})
					});

					if (!response.ok) {
						const errorData = await response.json();
						if (errorData.msg === "Este correo ya está registrado. Por favor, usa otro email.") {
							return "Este correo ya está registrado. Por favor, usa otro email.";
						}
						//alert(errorData.msg);
						throw new Error(errorData.msg);
					}

					const data = await response.json();
					console.log("User registered successfully:", data);

					return "User registered successfully";
				} catch (error) {
					console.error("Error al registrar:", error);
					return error.message || "Error al registrar el usuario.";
				}
			},

			getHotels: async () => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "api/hotels");
					if (response.ok) {
						const data = await response.json();
						setStore({ hotels: data.hotels }); // Actualiza el estado de los hoteles
					} else {
						console.error("Error fetching hotels:", response.status);
					}
				} catch (error) {
					console.error("Hubo un error al obtener los hoteles:", error);
				}
			},
			logOutAccount: async () => {
				
				localStorage.removeItem("user_session")
				localStorage.removeItem("user_type")
				localStorage.removeItem("user_fName")

			}
		}
	};
};

export default getState;
