import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import { orders, restaurants } from "./event-utils";
import { CgClose } from "react-icons/cg";
import "./App.css";

export default function DemoApp() {
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);

  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState<any>(undefined);
  const [eventos, setEventos] = useState(
    orders.filter((or) => or.restaurant.name === restaurants[0].id)
  );
  const [select, setSelect] = useState(restaurants[0].id);

  useEffect(() => {
    if (eventos?.length === 0) {
      const selectedEvents = orders.filter(
        (or) => or.restaurant.name === select
      );
      setEventos(selectedEvents);
    }
  }, [eventos?.length, select]);

  function calendar(eventOrders: any) {
    return (
      <FullCalendar
        weekends
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth",
        }}
        events={eventOrders} // alternatively, use the `events` setting to fetch from a feed
        initialView="dayGridMonth"
        height="95vh"
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        eventClick={handleEventClick}
      />
    );
  }

  function handleEventClick(event: any) {
    setInfo(event);
    const middleWidth = window.innerWidth / 2;
    const middleHeight = window.innerHeight / 2;
    if (Number(event.el.getBoundingClientRect().y.toFixed(2)) < middleHeight) {
      setTop(20);
    } else {
      setTop(window.innerHeight - 550);
    }
    if (Number(event.el.getBoundingClientRect().x.toFixed(2)) > middleWidth) {
      setLeft(Number(event.el.getBoundingClientRect().x.toFixed(2)) - 448);
    } else {
      setLeft(
        Number(event.el.getBoundingClientRect().x.toFixed(2)) +
          Number(event.el.getBoundingClientRect().width.toFixed(2))
      );
    }
    setOpen(true);
  }

  return (
    <div className="demo-app">
      <div className="demo-app-main">{calendar(eventos)}</div>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 100,
          height: "50px",
          zIndex: 99999,
          width: "150px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          marginTop: "2px",
        }}
      >
        <select
          value={select}
          onChange={(event) => {
            setEventos([]);
            setSelect(event.target.value);
          }}
          style={{ height: "38.4px", borderRadius: "8px" }}
        >
          {restaurants.map((res) => (
            <option value={res.id}>{res.name}</option>
          ))}
        </select>
      </div>
      {open && (
        <div
          style={{
            backgroundColor: "white",
            height: "510px",
            width: "448px",
            position: "absolute",
            top: `${top}px`,
            left: `${left}px`,
            zIndex: 5555555555,
            borderRadius: "9px",
            boxShadow: "0px -1px 12px -2px rgba(0,0,0,0.69)",
          }}
        >
          <div style={{ height: "100%", display: "flex", padding: "10px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                width: "100%",
                alignItems: "flex-end",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  marginRight: "10px",
                  cursor: "pointer",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={() => setOpen(false)}
              >
                <CgClose />
              </div>
              <div style={{ width: "100%", textAlign: "center" }}>
                <p>Name: {info?.event?._def?.title}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
