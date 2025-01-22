const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			username: "",
			user_type: "",
			user_fName: "",
			hotels: [],
			name: null,
			personalInfo: null, // Store for personal info data
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
			// Use getActions to call a function within a function
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
					const data = await resp.json();
					setStore({ message: data.message });
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error);
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

			// Fetch personal information for the PersonalInfo page
			fetchPersonalInfo: async () => {
				const token = localStorage.getItem("user_session"); // Assuming the token is stored here
				if (!token) {
					console.error("No token found!");
					return null;
				}
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/personal-info`, {
						headers: {
							Authorization: `Bearer ${token}`
						}
					});
					if (!response.ok) {
						throw new Error("Failed to fetch personal info");
					}
					const data = await response.json();
					setStore({ personalInfo: data }); // Update the store with personal info
					return data;
				} catch (error) {
					console.error("Error fetching personal info:", error);
					return null;
				}
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
					});

					const data = await response.json();

					//Seteo de los datos necesarios del usuario
					localStorage.setItem("user_session", data.access_token);
					await getActions().loadUserData();

					return data;
				} catch (error) {
					console.log("Error loading message from backend", error);
					return error;
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
				//eliminacion de la data del usuario
				localStorage.removeItem("user_session");
				setStore({ user_type: "" });
				setStore({ user_fName: "" });
				setStore({ username: "" });
			},

			loadUserData: async () => {
				//generacion de la data del usuario cada vez que refrezca la pagina
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/access", {
						headers: {
							Authorization: `Bearer ${localStorage.getItem("user_session")}`
						}
					});

					const data = await response.json();
					console.log(data[1]);
					setStore({ user_type: data[1].user_type });
					setStore({ user_fName: data[1].name });
					setStore({ username: data[1].username });

					if (!data) {
						return -1;
					}

					return data[1];
				} catch (error) {
					console.log(error);
					return error;
				}
			}
		}
	};
};

export default getState;
