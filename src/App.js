import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { ReactSVG } from "react-svg";
import { ReactComponent as ThreeDots  } from './icons_FEtask/3 dot menu.svg'; 
import { ReactComponent as Add } from './icons_FEtask/add.svg'; 
import { ReactComponent as Backlog } from './icons_FEtask/Backlog.svg'; 
import { ReactComponent as Cancelled } from './icons_FEtask/Cancelled.svg'; 
import { ReactComponent as Display } from './icons_FEtask/Display.svg'; 
import { ReactComponent as Done } from './icons_FEtask/Done.svg'; 
import { ReactComponent as down } from './icons_FEtask/down.svg'; 
import { ReactComponent as HighPriority } from './icons_FEtask/Img - High Priority.svg'; 
import { ReactComponent as LowPriority } from './icons_FEtask/Img - Low Priority.svg'; 
import { ReactComponent as MediumPriority } from './icons_FEtask/Img - Medium Priority.svg'; 
import { ReactComponent as InProg } from './icons_FEtask/in-progress.svg'; 
import { ReactComponent as NoPriority } from './icons_FEtask/No-priority.svg'; 
import { ReactComponent as UrgentPriorityColor } from './icons_FEtask/SVG - Urgent Priority colour.svg'; 
import { ReactComponent as UrgentPriorityGrey } from './icons_FEtask/SVG - Urgent Priority grey.svg'; 
import { ReactComponent as Todo } from './icons_FEtask/To-do.svg';




function RenderIcon(props){
  switch(props.ikey){
    case "Backlog":
      return <Backlog />;
    case "Cancelled":
      return <Cancelled />;
    case "In progress":
      return <InProg />;
    case "Todo":
      return <Todo />;
    case "Done":
      return <Done />;
    case "Display":
      return <Display />;
    case "0":
      return <NoPriority />;
    case "1":
      return <LowPriority />;
    case "2":
      return <MediumPriority />;
    case "3":
      return <HighPriority />;
    case "4":
      return <UrgentPriorityColor />;
    default:
      return null;
  }
}

function RenderIcon1(props){
  // console.log(props.ikey);
  switch(props.ikey){
    case 0:
      return <NoPriority />;
    case 1:
      return <LowPriority />;
    case 2:
      return <MediumPriority />;
    case 3:
      return <HighPriority />;
    case 4:
      return <UrgentPriorityGrey />;
    default:
      return null;
  }
}
function App() {
  
  const [apiData, setApiData] = useState(null);
  const [groupBy, setGroupBy] = useState(
    () => localStorage.getItem("groupBy") || "status"
  );
  const [sortBy, setSortBy] = useState("priority");
  const [isDropdownVisible, setDropdownVisible] = useState(false);


  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  useEffect(() => {

    //function to import api data
    const fetchData = async () => {
      const response = await fetch(
        "https://api.quicksell.co/v1/internal/frontend-assignment"
      );
      const data = await response.json();
      setApiData(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("groupBy", groupBy);
  }, [groupBy]);

  // Priority mapping
  const priorityLevels = {
    4: "Urgent",
    3: "High",
    2: "Medium",
    1: "Low",
    0: "No Priority",
  };

  const groupTickets = (tickets, criteria) => {
    if (criteria === "user") {
      return tickets.reduce((acc, ticket) => {
        const user = apiData.users.find((u) => u.id === ticket.userId);
        const key = user ? user.name : "Unknown User";
        if (!acc[key]) acc[key] = [];
        acc[key].push(ticket);
        return acc;
      }, {});
    } else {
      return tickets.reduce((acc, ticket) => {
        const key = ticket[criteria];
        if (!acc[key]) acc[key] = [];
        acc[key].push(ticket);
        return acc;
      }, {});
    }
  };

  const sortTickets = (tickets, criteria) => {
    if (criteria === "priority") {
      return tickets.sort((a, b) => b.priority - a.priority); // Descending priority
    } else if (criteria === "title") {
      return tickets.sort((a, b) => a.title.localeCompare(b.title)); // Ascending title
    }
    return tickets;
  };

  if (!apiData) return <div>Loading...</div>;

  const groupedTickets = groupTickets(apiData.tickets, groupBy);

  return (
    <div>
      

<div className="filter">
      <button onClick={toggleDropdown} className="display-button">
        Display
        <i className ="fa fa-caret-down"></i>
      </button>
  
      {isDropdownVisible && (
        <div className="dropdown">
          <div className="group-by">
            <label className = "margin-r" htmlFor="group-by">Grouping</label>
            <select
      
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
            >
              <option value="status">Status</option>
              <option value="user">User</option>
              <option value="priority">Priority</option>
            </select>
          </div>
          <div className="sort-by">
            <label className = "margin-r1" htmlFor="sort-by">Ordering</label>
            <select
              // id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      )}
    </div>
      {/* Display Grouped and Sorted Tickets */}
      <div className="container">
        {Object.keys(groupedTickets).map((groupKey) => (
          <div key={groupKey} className="column">
            <div className="make-horizontal">
            <span className="make-horizontal">
             <RenderIcon ikey={groupKey}  />
            <p className = 'margin-x make-bold'>
              {groupBy === "priority"
                ? `${priorityLevels[groupKey] || "No Priority"}`
                : groupKey}
            </p>
            <p>
              {groupedTickets[groupKey].length}
            </p>
            </span>
            <span>
              <Add />
              <ThreeDots  />
            </span>
            </div>

            {sortTickets(groupedTickets[groupKey], sortBy).map((ticket) => (
              <div key={ticket.id} className="ticket-card">
                <div className="ticket-card-header">
                  <p>{ticket.id}</p>
                 
                </div>
                <div className="ticket-card-body">
                  <div className="title-card-horizontal">
                  
                  { groupBy !== "status" ? <div className="margin-r"> < RenderIcon ikey = {ticket.status} /> </div>  : null}
                  <h4 className="margin-x">{ticket.title}</h4>
                  </div>
                </div>
                <div className="ticket-card-footer">
                  <div>
                    {ticket.tag.map((tag, index) => (
                      <div className="title-card-horizontal"  key={index}>
                        
                        
                        
                        { groupBy !== "priority" ? <div className="icon-border">< RenderIcon1 ikey = {ticket.priority} /></div>  : null}
                        <div className="card-tag">
                          <span className="grey-dot"></span>
                          <span>{tag}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
