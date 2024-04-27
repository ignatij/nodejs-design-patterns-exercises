"use strict";

class ArrivingState {
  constructor(warehouseItem) {
    this.warehouseItem = warehouseItem;
  }

  describe() {
    return "Item " + this.warehouseItem.id + " is on its way to the warehouse";
  }

  activate() {
    if (
      this.warehouseItem.state === "stored" ||
      this.warehouseItem.state === "delivered"
    ) {
      throw new Error("Arriving can be set only at the start!");
    }
    this.warehouseItem.state = "arriving";
  }
}

class StoredState {
  constructor(warehouseItem) {
    this.warehouseItem = warehouseItem;
  }

  activate(location) {
    if (this.warehouseItem.state === "delivered") {
      throw new Error(
        "Warehouse item cannot be moved back to stored once it is delivered!"
      );
    }
    this.location = location;
    this.warehouseItem.state = "stored";
  }

  describe() {
    return (
      "Item " +
      this.warehouseItem.id +
      " is stored on location " +
      this.location
    );
  }
}

class DeliveredState {
  constructor(warehouseItem) {
    this.warehouseItem = warehouseItem;
  }

  activate(address) {
    if (this.warehouseItem.state !== "stored") {
      throw new Error("Item has to be stored first before it is delivered!");
    }
    this.address = address;
    this.warehouseItem.states["stored"].location = null;
    this.warehouseItem.state = "delivered";
  }

  describe() {
    return (
      "Item " + this.warehouseItem.id + " was delivered to " + this.address
    );
  }
}

class WarehouseItem {
  constructor(id, state) {
    if (state !== "arriving") {
      throw new Error("Must be of state arriving first!");
    }

    this.id = id;
    this.states = {
      delivered: new DeliveredState(this),
      arriving: new ArrivingState(this),
      stored: new StoredState(this),
    };
    this.states[state].activate();
  }

  store(location) {
    this.states["stored"].activate(location);
  }

  deliver(address) {
    this.states["delivered"].activate(address);
  }

  describe() {
    return this.states[this.state].describe();
  }
}

const item = new WarehouseItem(1, "arriving");
console.log(item.describe());

item.store("1ZH3");
console.log(item.describe());

item.deliver("John Smith, 1st Avenue, New York");
console.log(item.describe());
