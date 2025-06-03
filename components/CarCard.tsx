import Card from "@/components/Card";
import {Car} from "@/model/Models";


export default function CarCard(props: {
    car: Car
}) {
    return (
        <Card
            title={props.car.name??""}
            secondaryText={props.car.registrationPlateNumber??""}
        />
    )
}