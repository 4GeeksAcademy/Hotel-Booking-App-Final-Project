import Swal from 'sweetalert2';

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			currentUser: {},
			userHotels: [],
			message: null,
			hotels: [],
			hotelsPriority: [],  // Almacena hoteles con paquete prioritario
			hotelsBasic: [],     // Almacenar hoteles con paquete básico
			hotel_packages: [], // Almacenamiento de los paquetes de estadia de los hoteles
			clicked_hotel: "",
			name: null,
			personalInfo: null, // Store for personal info data
			reservations: [],
			signupData: {},
			recovery_mail: [],
			hotelDetails: [],
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
			signUp: async (name, last_name, email, username, password, user_type, phone_number) => {
				console.log(name, last_name, email, username, password, user_type, phone_number);

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
						user_type: user_type,
						phone_number: phone_number
					})
				});

				// Si la respuesta no es correcta, manejar error
				if (!response.ok) {
					const errorData = await response.json();
					return errorData.msg
				}
				const data = await response.json();
				console.log("User registered successfully:", data);

				return "User registered successfully"; // Se devuelve mensaje de éxito

			},

			// Fetch personal information for the PersonalInfo page
			fetchPersonalInfo: async () => {
				const token = localStorage.getItem("user_session"); // Assuming the token is stored here
				const actions = getActions()
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/personal-info`, {
						headers: {
							Authorization: `Bearer ${token}`
						}
					});
					if (!response.ok) {
						if (response.status == 401) {
							actions.logOutAccount()
						}
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
				const token = localStorage.getItem("user_session");
				if (!token) {
					console.error("No token found!");
					return false;
				}

				console.log("🚀 Sending updated hotel info:", formData);

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
					console.log("✅ Hotel personal info updated:", data);
					return true;
				} catch (error) {
					console.error("❌ Error updating hotel personal info:", error);
					return false;
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
					if (!response.ok) {
						const errorData = await response.json();
						return errorData.msg
					}
					
					const data = await response.json();
					//Seteo de los datos necesarios del usuario
					localStorage.setItem("user_session", data.access_token);
					setStore({ currentUser: data.user })
					// await getActions().loadUserData();

					return data;
					

				} catch (error) {
					console.log("Error loading message from backend", error);
					return error;
				}
			},

			setSignUpData: (key, value, clear = false) => {
				if (!clear) {
					const store = getStore()
					setStore({ signupData: { ...store.signupData, [key]: value } })
				} else {
					setStore({ signupData: {} })
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
					} else {
						setStore({ currentUser: null })
					}
				} catch (error) {
					setStore({ currentUser: null })
					console.log(error);
					return error;
				}
			},
			loadHotelPackages: async () => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/hotel_packages");

					const data = await response.json();


					await setStore({ hotel_packages: data.hotel_packages })

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
					console.log("✅ Hotel successfully deactivated:", data);

					// Update store state
					const updatedHotels = getStore().userHotels.map((hotel) =>
						hotel.id_hotel === hotelId ? { ...hotel, is_active: false } : hotel
					);
					setStore({ userHotels: updatedHotels });

					return true;
				} catch (error) {
					console.error("Error deactivating hotel:", error);
					return false;
				}
			},

			reactivateHotel: async (hotelId) => {
				const token = localStorage.getItem("user_session");

				if (!token) {
					console.error("No token found!");
					return false;
				}

				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/hotels/${hotelId}/status`, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({ is_active: true }),
					});

					if (!response.ok) {
						throw new Error("Failed to reactivate hotel");
					}

					const data = await response.json();
					console.log("✅ Hotel successfully reactivated:", data);

					// Update store state
					const updatedHotels = getStore().userHotels.map((hotel) =>
						hotel.id_hotel === hotelId ? { ...hotel, is_active: true } : hotel
					);
					setStore({ userHotels: updatedHotels });

					return true;
				} catch (error) {
					console.error("Error reactivating hotel:", error);
					return false;
				}
			},
			/*send personal info cliente to API*/
			savePersonalInfo: async (formData) => {
				const token = localStorage.getItem("user_session");
				if (!token) {
					console.error("❌ No token found!");
					return false;
				}

				console.log("🚀 Sending updated info to backend:", formData); // ✅ Debugging log

				if (!formData.profile_image) {
					console.warn("⚠️ WARNING: profile_image is missing before sending request!");
				}

				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/user/update`, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify(formData),
					});

					if (!response.ok) {
						throw new Error("❌ Failed to update personal info");
					}

					const data = await response.json();
					console.log("✅ Personal info updated successfully:", data); // ✅ Debugging log

					setStore({ personalInfo: { ...getStore().personalInfo, ...data } });

					return true;
				} catch (error) {
					console.error("❌ Error updating personal info:", error);
					return false;
				}
			},




			// Obtener las reservas de los usuarios en el carrito
			getUserReservations: async () => {
				const actions = getActions()
				const token = localStorage.getItem("user_session"); // Assuming the token is stored here
				try {
					const response = await fetch(process.env.BACKEND_URL + "api/user/reservations", {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`
						},
					});
					if (response.status == 401) {
						actions.logOutAccount()
						return null
					}
					const data = await response.json();
					console.log('Datos de reservas:', data);  // Para depurar la respuesta
					console.log('Usuario:', token);


					if (response.ok) {
						setStore({ reservations: data.reservations || [] });
						console.log("Reservas almacenadas en el store:", data.reservations); // Verifica lo que se guarda en el store
					} else {
						console.error("Error al obtener reservas:", data.error || 'Error desconocido');
					}
				} catch (error) {
					console.error("Error en la petición:", error);
				}

			},

			selectPlan: async (planId) => {
				console.log("selectPlan called with:", planId); // ✅ Log every call

				if (!planId || isNaN(planId)) {
					console.error("❌ Invalid plan ID:", planId);
					return null;
				}

				const token = localStorage.getItem("user_session");
				if (!token) {
					console.error("❌ No token found!");
					return null;
				}

				try {
					const body = JSON.stringify({ plan_id: planId });


					const response = await fetch(`${process.env.BACKEND_URL}/api/hotel-plan`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: body,
					});

					const responseData = await response.json();


					if (response.ok) {
						return responseData.message; // Success message
					} else {
						console.error("⚠️ Error selecting plan:", responseData);
						return null;
					}
				} catch (error) {
					console.error("⚠️ Error selecting plan:", error);
					return null;
				}
			},

			getUserHotels: async () => {
				const token = localStorage.getItem("user_session");
				if (!token) return console.error("No token found!");

				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/user/hotels/single`, {
						headers: { Authorization: `Bearer ${token}` }
					});

					if (response.ok) {
						const data = await response.json();
						setStore({ userHotels: data });
						return data;
					}
				} catch (error) {
					console.error("Error fetching hotels:", error);
				}
			},

			getPackages: async () => {
				const token = localStorage.getItem("user_session");
				if (!token) return console.error("No token found!");

				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/hotel-packages`, {
						headers: { Authorization: `Bearer ${token}` }
					});

					if (response.ok) {
						const data = await response.json();
						setStore({ userPackages: data });
						return data;
					}
				} catch (error) {
					console.error("Error fetching packages:", error);
				}
			},

			addPackage: async (packageData) => {
				const token = localStorage.getItem("user_session");
				if (!token) {
					console.error("No token found!");
					return false;
				}

				try {


					const response = await fetch(`${process.env.BACKEND_URL}/api/hotel-packages`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({
							package_name: packageData.packageName,  // ✅ Matches backend field name
							hotel_id: packageData.hotelId,          // ✅ Matches backend field name
							price: packageData.price,               // ✅ Ensure correct format
							start_date: packageData.startDate,
							end_date: packageData.endDate,
							description: packageData.description
						}),
					});

					const data = await response.json();


					if (response.ok) {
						return true;
					} else {
						console.error("❌ Error adding package:", data.message);
						return false;
					}
				} catch (error) {
					console.error("⚠️ Error adding package:", error);
					return false;
				}
			},



			fetchHotelPackages: async () => {
				const token = localStorage.getItem("user_session");
				if (!token) {
					console.error("❌ No token found!");
					return null;
				}

				try {

					const response = await fetch(`${process.env.BACKEND_URL}/api/hotel-packages`, {
						headers: {
							"Authorization": `Bearer ${token}`
						}
					});

					if (!response.ok) {
						const errorData = await response.json();
						console.error("❌ Backend error:", errorData.message);
						return null;
					}

					const data = await response.json();

					return data;
				} catch (error) {
					console.error("❌ Error fetching hotel packages:", error);
					return null;
				}
			},
			resetAccPassword: async (userPassReset) => {
				//Verificacion de existencia del usuario
				try {
					const response = await fetch(`${process.env.BACKEND_URL}api/pass-reset`, {
						method: "POST",
						headers: {
							"Content-type": "application/json"
						},
						body: JSON.stringify(
							{
								"user": userPassReset
							}
						)
					});

					if (!response.ok) {
						const errorData = await response.json();
						console.error("❌ Backend error:", errorData.message);
						return null;
					}

					//Generacion del codigo de renicio de password con su timer de 15 minutos
					const codeGenerated = getActions().resetCodeGen()


					const codeTimer = Date.now() + 900000;
					// setStore({resetCode: codeGenerated })
					// setStore({codeExpiration: codeTimer })
					setStore({ recovery_mail: userPassReset })

					console.log(codeGenerated)
					console.log(codeTimer)

					getActions().sendEmailNotification(userPassReset, codeGenerated, codeTimer)


					const data = await response.json();
					console.log("📥 Reset code:", codeGenerated);
					return data;
				} catch (error) {
					console.error("❌ Error fetching password reset packages:", error);
					return null;
				}
			},
			resetCodeGen: () => {
				let resetCodeValue = ''
				const characters = 'ABCDEFGHIJKLMNOPRQSTUVWXYZ0123456789';
				const charactersLength = 4;
				let counter = 0;
				while (counter < charactersLength) {
					resetCodeValue += characters.charAt(Math.floor(Math.random() * charactersLength));
					counter += 1;
				}
				console.log("codigo generado" + resetCodeValue)



				return resetCodeValue
			},
			sendEmailNotification: async (userMail, code, code_date) => {
				//Envio del correo con el codigo
				try {
					const response = await fetch(`${process.env.BACKEND_URL}api/send-email`, {
						method: "PUT",
						headers: {
							"Content-type": "application/json"
						},
						body: JSON.stringify(
							{
								"email": userMail,
								"code": code,
								"code_date": code_date
							}
						)
					});

					if (!response.ok) {
						const errorData = await response.json();
						console.error("❌ Backend error:", errorData.message);
						return null;
					}


					console.log("We sent it!")
					return true;
				}
				catch (error) {
					console.error("❌ Error fetching password reset packages:", error);
					return null;
				}
			},
			codeVerification: async (inputToCheck) => {
				//Envio del correo con el codigo
				const code_date = Date.now()
				try {
					const response = await fetch(`${process.env.BACKEND_URL}api/code-verification`, {
						method: "PUT",
						headers: {
							"Content-type": "application/json"
						},
						body: JSON.stringify(
							{
								"email": getStore().recovery_mail,
								"code": inputToCheck,
								"code_date": code_date
							}
						)
					});

					if (!response.ok) {
						const errorData = await response.json();
						console.error("❌ Backend error:", errorData.message);
						return null;
					}


					console.log("checked!")
					return true;
				}
				catch (error) {
					console.error("❌ Error fetching password reset packages:", error);
					return null;
				}
			},

			/*favorite hotels profile page fetching*/

			addFavoriteHotel: async (hotel) => {
				console.log("⭐ Adding hotel to favorites:", hotel);
				const token = localStorage.getItem("user_session");
				if (!token) {
					console.error("No token found!");
					return false;
				}
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/user/favorites`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({ hotel_id: hotel.id_hotel }),
					});

					if (!response.ok) {
						throw new Error("Failed to add favorite hotel");
					}

					console.log("✅ Hotel added to favorites:", hotel.name);
					getActions().getFavoriteHotels(); // Refresh favorites after adding
					return true;
				} catch (error) {
					console.error("Error adding favorite hotel:", error);
					return false;
				}
			},


			getFavoriteHotels: async () => {
				const token = localStorage.getItem("user_session");
				if (!token) {
					console.error("No token found!");
					return;
				}

				try {
					console.log("Fetching favorites from:", process.env.BACKEND_URL + "/api/user/favorites");

					const backendURL = process.env.BACKEND_URL.replace(/\/$/, "");  // Remove trailing slash

					const response = await fetch(`${backendURL}/api/user/favorites`, {
						headers: { Authorization: `Bearer ${token}` }
					});

					console.log("Response status:", response.status);

					if (!response.ok) {
						throw new Error(`Failed to fetch favorite hotels: ${response.status} ${response.statusText}`);
					}

					const data = await response.json();
					console.log("Fetched favorite hotels:", data);

					setStore({ favoriteHotels: Array.isArray(data) ? data : [] });
				} catch (error) {
					console.error("Error fetching favorite hotels:", error);
				}
			},


			removeFavoriteHotel: async (hotelId) => {
				const token = localStorage.getItem("user_session");
				if (!token) {
					console.error("No token found!");
					return false;
				}
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/user/favorites/${hotelId}`, {
						method: "DELETE",
						headers: {
							Authorization: `Bearer ${token}`
						}
					});
					if (!response.ok) {
						throw new Error("Failed to remove favorite hotel");
					}
					getActions().getFavoriteHotels();

					return true;

				} catch (error) {
					console.error("Error removing favorite hotel:", error);
					return false;
				}
			},




			checkPasswordRecovery: async (email, verificationCode) => {
				const recoveryDate = Date.now()

				const response = await fetch(`${process.env.BACKEND_URL}api/pass-reset-check`, {
					method: "PUT",
					headers: {
						"Content-type": "application/json"
					},
					body: JSON.stringify(
						{
							"email": email,
							"code": verificationCode,
							"code_date": recoveryDate
						}
					)
				});

				if (!response.ok) {
					const errorData = await response.json();
					console.error("❌ Backend error:", errorData.message);
					return null;
				}

				try {
					const data = response.json()
					console.log(data)
					return data;
				}
				catch (error) {
					console.error("Error removing favorite hotel:", error);
					return false;
				}
			},
			changePassword: async (newPassword, email) => {
				const response = await fetch(`${process.env.BACKEND_URL}api/change-password`, {
					method: "PUT",
					headers: {
						"Content-type": "application/json"
					},
					body: JSON.stringify(
						{
							"newPassword": newPassword,
							"email": email
						}
					)
				});

				if (!response.ok) {
					const errorData = await response.json();
					console.error("❌ Backend error:", errorData.message);
					return null;
				}

				try {
					const data = response.json()
					console.log(data)
					return data;
				}
				catch (error) {
					console.error("Error removing favorite hotel:", error);
					return false;
				}
			},
			/*favorite hotels profile page fetching*/
			getFavoriteHotels: async () => {
				const token = localStorage.getItem("user_session");
				if (!token) {
					console.error("No token found!");
					return;
				}

				try {
					console.log("Fetching favorites from:", process.env.BACKEND_URL + "/api/user/favorites");

					const backendURL = process.env.BACKEND_URL.replace(/\/$/, "");  // Remove trailing slash

					const response = await fetch(`${backendURL}/api/user/favorites`, {
						headers: { Authorization: `Bearer ${token}` }
					});

					console.log("Response status:", response.status);

					if (!response.ok) {
						throw new Error(`Failed to fetch favorite hotels: ${response.status} ${response.statusText}`);
					}

					const data = await response.json();
					console.log("Fetched favorite hotels:", data);

					setStore({ favoriteHotels: Array.isArray(data) ? data : [] });
				} catch (error) {
					console.error("Error fetching favorite hotels:", error);
				}
			},



			removeFavoriteHotel: async (hotelId) => {
				const token = localStorage.getItem("user_session");
				if (!token) {
					console.error("No token found!");
					return false;
				}
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/user/favorites/${hotelId}`, {
						method: "DELETE",
						headers: {
							Authorization: `Bearer ${token}`
						}
					});
					if (!response.ok) {
						throw new Error("Failed to remove favorite hotel");
					}
					getActions().getFavoriteHotels();
					return true;
				} catch (error) {
					console.error("Error removing favorite hotel:", error);
					return false;
				}
			},
			checkPasswordRecovery: async (email, verificationCode) => {
				const recoveryDate = Date.now()

				const response = await fetch(`${process.env.BACKEND_URL}api/pass-reset-check`, {
					method: "PUT",
					headers: {
						"Content-type": "application/json"
					},
					body: JSON.stringify(
						{
							"email": email,
							"code": verificationCode,
							"code_date": recoveryDate
						}
					)
				});

				if (!response.ok) {
					const errorData = await response.json();
					console.error("❌ Backend error:", errorData.message);
					return null;
				}

				try {
					const data = response.json()
					console.log(data)
					return data;
				}
				catch (error) {
					console.error("Error removing favorite hotel:", error);
					return false;
				}
			},
			changePassword: async (newPassword, email) => {
				const response = await fetch(`${process.env.BACKEND_URL}api/change-password`, {
					method: "PUT",
					headers: {
						"Content-type": "application/json"
					},
					body: JSON.stringify(
						{
							"newPassword": newPassword,
							"email": email
						}
					)
				});

				if (!response.ok) {
					const errorData = await response.json();
					console.error("❌ Backend error:", errorData.message);
					return null;
				}

				try {
					const data = response.json()
					console.log(data)
					return data;
				}
				catch (error) {
					console.error("Error removing favorite hotel:", error);
					return false;
				}
			},
			/*favorite hotels profile page fetching*/
			getFavoriteHotels: async () => {
				const token = localStorage.getItem("user_session");
				if (!token) {
					console.error("No token found!");
					return;
				}

				try {
					console.log("Fetching favorites from:", process.env.BACKEND_URL + "/api/user/favorites");

					const backendURL = process.env.BACKEND_URL.replace(/\/$/, "");  // Remove trailing slash

					const response = await fetch(`${backendURL}/api/user/favorites`, {
						headers: { Authorization: `Bearer ${token}` }
					});

					console.log("Response status:", response.status);

					if (!response.ok) {
						throw new Error(`Failed to fetch favorite hotels: ${response.status} ${response.statusText}`);
					}

					const data = await response.json();
					console.log("Fetched favorite hotels:", data);

					setStore({ favoriteHotels: Array.isArray(data) ? data : [] });
				} catch (error) {
					console.error("Error fetching favorite hotels:", error);
				}
			},
			removeFavoriteHotel: async (hotelId) => {
				const token = localStorage.getItem("user_session");
				if (!token) {
					console.error("No token found!");
					return false;
				}
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/user/favorites/${hotelId}`, {
						method: "DELETE",
						headers: {
							Authorization: `Bearer ${token}`
						}
					});
					if (!response.ok) {
						throw new Error("Failed to remove favorite hotel");
					}
					getActions().getFavoriteHotels();
					return true;
				} catch (error) {
					console.error("Error removing favorite hotel:", error);
					return false;
				}
			},
			getGoogleInformation: async (credentialResponse) => {
				console.log(credentialResponse.credential)
				try {
					const response = await fetch(`${process.env.BACKEND_URL}api/google/verify`, {
						method: "POST",
						headers: {
							"Content-type": "application/json"
						},
						body: JSON.stringify(
							{
								"credential": credentialResponse.credential,
							}
						)
					});
					if (response.ok) {

						const data = await response.json();

						const email_data = getActions().verifyGoogleAccount(credentialResponse.credential)

						return email_data; // Retornar los hoteles básicos
					} else {
						console.error("Error signing in with Google:", response.status);
					}
				} catch (error) {
					console.error("Error signing in with Google:", error);
				}

			},
			verifyGoogleAccount: async (user_token) => {
				console.log(user_token)
				try {

					const response = await fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + user_token);
					if (response.ok) {

						const data = await response.json();
						console.log(data);


						return data; // Retornar los datos del email
					} else {
						console.error("Error google verification:", response.status);
					}
				} catch (error) {
					console.error("Error google verification:", error);
				}
			},
			loginGoogleAccount: async (email_data) => {
				//generacion de la data del usuario cada vez que refrezca la pagina
				try {
					const response = await fetch(`${process.env.BACKEND_URL}api/google/login`, {
						method: "POST",
						headers: {
							"Content-type": "application/json"
						},
						body: JSON.stringify(
							{
								"email": email_data.email,
							}
						)
					});
					if(!response.ok){
						const errorMsg = await response.json()
						return errorMsg.msg
					}

					const data = await response.json();
					console.log(data)

					localStorage.setItem("user_session", data.access_token);
					setStore({ currentUser: data.user })

					return data; // Retornar los hoteles básicos

				} catch (error) {
					console.error("Error signing in with Google:", error);
				}
			},
			addToCart: async (package_data) => {
				const token = localStorage.getItem("user_session");
				if (!token) {
					console.error("No token found!");
					return false;
				}
				console.log(package_data)
				try {
					const response = await fetch(`${process.env.BACKEND_URL}api/user/reserve`, {
						method: "POST",
						headers: {
							"Content-type": "application/json",
							Authorization: `Bearer ${token}`
						},
						body: JSON.stringify(
							{
								"package_data": package_data
							}
						)
					});
					if (!response.ok) {
						throw new Error("Failed to add item");
					}
					const data = response.json()

					return data;
				} catch (error) {
					console.error("Error adding item to cart:", error);
					return false;
				}
			},
			// ELIMINAR RESERVAS
			handleDeleteReservation: async (id_reservation) => {
				console.log("ID of the reservation to be deleted:", id_reservation);

				const token = localStorage.getItem("user_session");
				if (!token) {
					Swal.fire("Error", "No session token found.", "error");
					return;
				}

				const confirmDelete = await Swal.fire({
					title: "You're sure?",
					text: "This action will permanently delete the reservation.",
					icon: "warning",
					showCancelButton: true,
					confirmButtonColor: "#d33",
					cancelButtonColor: "#3085d6",
					confirmButtonText: "Yes, delete",
					cancelButtonText: "Cancel"
				});

				if (confirmDelete.isConfirmed) {
					try {
						const response = await fetch(`${process.env.BACKEND_URL}/api/reservations/${id_reservation}`, {
							method: "DELETE",
							headers: {
								"Authorization": `Bearer ${token}`,
								"Content-Type": "application/json"
							}
						});

						if (response.ok) {
							const data = await response.json();
							Swal.fire("Deleted", data.msg, "success");

							// Actualizar la lista de reservas en el frontend
							getActions().getUserReservations();  // Llamar a la función que actualiza la lista
						} else {
							const errorData = await response.json();
							Swal.fire("Error", errorData.msg || "The reservation could not be deleted.", "error");
						}
					} catch (error) {
						console.error("Error deleting reservation:", error);
						Swal.fire("Error", "An error occurred while deleting the reservation.", "error");
					}
				}
			},
			handleDeleteAllReservations: async () => {
				console.log("Removing all reservations...");

				const token = localStorage.getItem("user_session");
				if (!token) {
					Swal.fire("Error", "No session token found.", "error");
					return;
				}

				const confirmDelete = await Swal.fire({
					title: "You're sure?",
					text: "This action will permanently delete ALL your reservations.",
					icon: "warning",
					showCancelButton: true,
					confirmButtonColor: "#d33",
					cancelButtonColor: "#3085d6",
					confirmButtonText: "Yes, delete",
					cancelButtonText: "Cancel"
				});

				if (confirmDelete.isConfirmed) {
					try {
						const response = await fetch(`${process.env.BACKEND_URL}/api/user/reservations`, {
							method: "DELETE",
							headers: {
								"Authorization": `Bearer ${token}`,
								"Content-Type": "application/json"
							}
						});

						if (response.ok) {
							const data = await response.json();
							Swal.fire("Deleted", data.msg, "success");

							// Actualizar la lista de reservas en el frontend
							getActions().getUserReservations();
						} else {
							const errorData = await response.json();
							Swal.fire("Error", errorData.msg || "Reservations could not be deleted.", "error");
						}
					} catch (error) {
						console.error("Error deleting reservations:", error);
						Swal.fire("Error", "An error occurred while deleting reservations.", "error");
					}
				}
			}
		},

		/*getting the paid reservations only */

		getPaidReservations: async () => {
			const token = localStorage.getItem("user_session");
			if (!token) {
				console.error("No token found!");
				return false;
			}
			try {
				// Fetch all reservations (pending + paid)
				const response = await fetch(`${process.env.BACKEND_URL}api/user/reservations`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`
					},
				});

				const data = await response.json();
				console.log('📌 All User Reservations:', data);

				if (response.ok) {
					// ✅ Filter out only PAID reservations
					const paidReservations = data.reservations.filter(reservation => reservation.is_paid);
					setStore({ paidReservations });
					console.log("✅ Stored only PAID reservations in Flux:", paidReservations);
				} else {
					console.error("❌ Error fetching reservations:", data.error || 'Unknown error');
				}
			} catch (error) {
				console.error("❌ Error in request:", error);
			}
		},

	}
};



export default getState;
