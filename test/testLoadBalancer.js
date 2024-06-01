import axios from "axios";

const testLoadBalancer = async () => {
  try {
    let response = await axios.get("http://localhost:3000/balance/leastload");
    console.log(response.data);

    response = await axios.get("http://localhost:3000/balance/fifo");
    console.log(response.data);

    response = await axios.get("http://localhost:3000/balance/priority");
    console.log(response.data);

    response = await axios.get("http://localhost:3000/balance/roundrobin");
    console.log(response.data);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

testLoadBalancer();
