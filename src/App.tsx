import { FormEvent, useEffect, useState } from 'react'
import './App.css'
import "bootstrap/dist/css/bootstrap.css";

interface Car{
id: number,
lincense_plate_number: string,
brand: string,
model:string,
daily_cost: number,
}

function App() {
  const [id,setId] = useState(0);
  const [lpNumber, setLpNumber]= useState("");
  const [brand,setBrand]= useState("");
  const [model,setModel]= useState("");
  const [daily_cost, setDaily_cost]=useState(0);
  const [img,setImg]= useState("");
  const [list, setList]= useState<Car[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError]= useState("");

  async function datafetch() {
    const res = await fetch("http://localhost:3000/api/cars");
    const data = await res.json();
    setList(data);
  }

  useEffect(()=>{
    datafetch();
  },[])

  async function addNewCar(e: FormEvent){
    e.preventDefault();

    const car={
      lpNumber,
      brand,
      model,
      daily_cost,
    }

    const res = await fetch("http://localhost:3000/api/cars",{
      method:"POST",
      headers: { "Content-type": "application/json"
    },
    body: JSON.stringify(car)
    })

    if(res.ok){
      setBrand("");
      setModel("");
      setDaily_cost(0);
      setLpNumber("");
      datafetch();
    }else{
      const hiba= await res.json();
      setError(hiba);
      alert(error);
    }
  }

  async function rentCar(carId: number) {
    try {
      const res = await fetch(`http://localhost:3000/api/cars/${carId}/rent`, {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        }
      });

      if (res.ok) {
        setSuccessMessage("Sikeres kölcsönzés!");
        setErrorMessage("");
        datafetch();
      } else {
        const errorData = await res.json();
        setSuccessMessage("");
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage("Hiba történt a kölcsönzés során.");
    }
  }


  return (
    <div>
      <header>
        <h1>Petrik Autókölcsönző</h1>
        <nav>
          <a href="#new-car-form">Új autó felvétele     </a>
          <a href="https://petrik.hu/">Petrik honlap</a>
        </nav>
      </header>
    <div className='container-fluid'>
    <div className='row'>
      {list.map((car, i) => (
        <div key={i} style={{marginTop:'10px'}} className='col-12 col-sm-6 col-md-4 '>
          <div style={{ border: '2px solid grey' , padding:'10px'}}>
            <h1>{car.lincense_plate_number}</h1>
            <p>Márka: {car.brand}</p>
            <p>Modell: {car.model}</p>
            <p>Napidíj: {car.daily_cost} Ft</p>
            <img src={`/public/kepek/${car.brand}_${car.model}.png`} alt={`${car.brand} ${car.model}`} />
            <button onClick={() => rentCar(car.id)}>Kölcsönzés</button>
          </div>
        </div>
      ))}
    </div>

      <div>

        <form id='new-car-form' onSubmit={addNewCar}>
        <label htmlFor="Cím"> Rendszám:</label>
            <input type="text" value={lpNumber} onChange={(e)=> setLpNumber(e.currentTarget.value)}/> <br />

            <label htmlFor="Szerző">Mátka</label>
            <input type="text" value={brand} onChange={(e)=> setBrand(e.currentTarget.value)}/> <br />

            <label htmlFor="Kiadás éve">Modell:</label>
            <input type="text" value={model} onChange={(e)=> setModel(e.currentTarget.value)}/> <br />

            <label htmlFor="Oldalszám">Ár:</label>
            <input type="number" value={daily_cost} onChange={(e)=> setDaily_cost(parseInt(e.currentTarget.value))}/> <br />

          
          <input type="submit" value={"Új autó"}/>
        </form>
      
      </div>  

  </div>
  <footer>
        <p>Készítette: Varga Norbert</p>
      </footer>
  </div>
  )
}

export default App
