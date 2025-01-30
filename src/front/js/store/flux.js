const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			currentUser: null,
			userHotels: [],
			message: null,
			hotels: [],
			hotelsPriority: [],  // Almacena hoteles con paquete prioritario
			hotelsBasic: [],     // Almacenar hoteles con paquete básico
			hotel_packages: [], // Almacenamiento de los paquetes de estadia de los hoteles
			name: null,
			personalInfo: null, // Store for personal info data
			signupData: {},
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

			fetchHotelPersonalInfo: async () => {
				const token = localStorage.getItem("user_session"); // Assuming the token is stored here
				if (!token) {
					console.error("No token found!");
					return null;
				}
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/hotel-personal-info`, {
						headers: {
							Authorization: `Bearer ${token}`
						}
					});
					if (!response.ok) {
						throw new Error("Failed to fetch hotel personal info");
					}
					const data = await response.json();
					setStore({ personalInfo: data }); // Update the store with hotel personal info
					return data;
				} catch (error) {
					console.error("Error fetching hotel personal info:", error);
					return null;
				}
			},
			/*edita el personal information del hotel desde el perfil de hotel */
			updateHotelPersonalInfo: async (formData) => {
				const token = localStorage.getItem("user_session"); // Assuming the token is stored here
				if (!token) {
					console.error("No token found!");
					return false;
				}
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/hotel-personal-info`, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify(formData),
					});

					if (!response.ok) {
						throw new Error("Failed to update hotel personal info");
					}

					const data = await response.json();
					console.log("Hotel personal info updated:", data);
					return true; // Return success
				} catch (error) {
					console.error("Error updating hotel personal info:", error);
					return false; // Return failure
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
					if (response.ok) {
						//Seteo de los datos necesarios del usuario
						localStorage.setItem("user_session", data.access_token);
						setStore({ currentUser: data.user })
						// await getActions().loadUserData();

						return data;
					}

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
					console.error("Error registering:", error);
					return error.message || "This email or username is already registered, try it again.";
				}
			},

			setSignUpData: (key, value, clear = false) => {
				if (!clear) {
					const store = getStore()
					setStore({ signupData: { ...store.signupData, [key]: value } })
				} else {
					setStore({ signupData :{}})
				}
			},

			// getHotels: async () => {
			// 	try {
			// 		const response = await fetch(process.env.BACKEND_URL + "api/hotels");
			// 		if (response.ok) {
			// 			const data = await response.json();
			// 			setStore({ hotels: data.hotels }); // Actualiza el estado de los hoteles
			// 		} else {
			// 			console.error("Error fetching hotels:", response.status);
			// 		}
			// 	} catch (error) {
			// 		console.error("Hubo un error al obtener los hoteles:", error);
			// 	}
			// },

			getPriorityHotels: async () => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/hotels/priority");
					if (response.ok) {
						const data = await response.json();
						setStore({ hotelsPriority: data }); // Guardar hoteles prioritarios en el estado global
						return data; // Retornar los hoteles prioritarios
					} else {
						console.error("Error fetching priority hotels:", response.status);
					}
				} catch (error) {
					console.error("Error fetching priority hotels:", error);
				}
			},

			getBasicHotels: async () => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/hotels/basic");
					if (response.ok) {
						const data = await response.json();
						console.log(data);
						setStore({ hotelsBasic: data }); // Guardar hoteles básicos en el estado global
						return data; // Retornar los hoteles básicos
					} else {
						console.error("Error fetching basic hotels:", response.status);
					}
				} catch (error) {
					console.error("Error fetching basic hotels:", error);
				}
			},

			logOutAccount: async () => {
				//eliminacion de la data del usuario
				localStorage.removeItem("user_session");
				setStore({ currentUser: false });
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
					if (response.ok) {
						setStore({ currentUser: data })
						// await getActions().loadUserData();

						return data;
					}
				} catch (error) {
					console.log(error);
					return error;
				}
			},
			loadHotelPackages: async () =>{
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/hotel_packages");

					const data = await response.json();
					

					await setStore({hotel_packages: data.hotel_packages})

					console.log(data);


					return data;


				} catch (error) {
					console.log(error);
					return error;
				}
			},
			addHotel: async (hotelData) => {

				const token = localStorage.getItem("user_session");
				if (!token) {
					console.error("No token found!");
					return false;
				}
				try {

					const response = await fetch(`${process.env.BACKEND_URL}/api/hotels`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify(hotelData),
					});

					if (!response.ok) {
						throw new Error("Failed to add hotel");
					}

					const data = await response.json();
					console.log("Hotel successfully added:", data);
					const actions = getActions();
					await actions.getUserHotels();
					return true;
				} catch (error) {
					console.error("Error adding hotel:", error);
					return false;
				}
			},



			getUserHotels: async () => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/user/hotels`, { headers: { "Authorization": 'Bearer ' + localStorage.getItem('user_session') } });
					if (response.ok) {
						const data = await response.json();
						setStore({ userHotels: data }); // Update the hotels state
						console.log("Hotels fetched successfully:", data.hotels);
					} else {
						console.error("Error fetching hotels:", response.status);
					}
				} catch (error) {
					console.error("Error fetching hotels:", error);
				}
			},

			/*deactivate hotel from hotel profile*/
			deactivateHotel: async (hotelId) => {
				const token = localStorage.getItem("user_session");

				if (!token) {
					console.error("No token found!");
					return false;
				}
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/hotels/${hotelId}`, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({ is_active: false }),
					});

					if (!response.ok) {
						throw new Error("Failed to deactivate hotel");
					}

					const data = await response.json();
					console.log("Hotel successfully deactivated:", data);

					// Refresh the list of hotels
					const actions = getActions();
					await actions.getHotels();

					return true;
				} catch (error) {
					console.error("Error deactivating hotel:", error);
					return false;
				}
			},
			/*send personal info cliente to API*/
			savePersonalInfo: async (formData) => {
				const token = localStorage.getItem("user_session"); // Assuming the token is stored here
				if (!token) {
					console.error("No token found!");
					return false;
				}
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/personal-info`, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`
						},
						body: JSON.stringify(formData)
					});

					if (!response.ok) {
						throw new Error("Failed to update personal info");
					}

					const data = await response.json();
					console.log("Personal info updated successfully:", data);

					// Update the personalInfo in the store
					setStore({ personalInfo: data });

					return true;
				} catch (error) {
					console.error("Error updating personal info:", error);
					return false;
				}
			}
		}
	};
};

export default getState;
