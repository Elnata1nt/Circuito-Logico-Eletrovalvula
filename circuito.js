class AdvancedWaterFilterControlSystem {
    constructor() {
        this.sensorA = 0;
        this.sensorB = 0;
        this.valveStatus = false;
        this.log = [];
        this.simulationInterval = null;
        this.isManualMode = true;
        this.isFillingA = false;
        this.isFillingB = false;
    }

    toggleMode() {
        const mode = document.getElementById("mode").value;
        this.isManualMode = (mode === 'manual');
        document.getElementById("speedControl").style.display = this.isManualMode ? 'none' : 'block';
    }

    updateSensors(sensorA, sensorB) {
        this.sensorA = parseInt(sensorA, 10);
        this.sensorB = parseInt(sensorB, 10);
        this.updateVisuals();
        this.addLog(`Sensores atualizados - Sensor A: ${this.sensorA}, Sensor B: ${this.sensorB}`);
        this.checkValveStatus();
    }

    checkValveStatus() {
        if (this.sensorA === 0 && this.sensorB === 0 && !this.isFillingA && !this.isFillingB) {
            this.valveStatus = true;
            this.fillTankAFirst();
        } else if (this.sensorA === 1 && this.sensorB === 0 && !this.isFillingB) {
            this.valveStatus = true;
            this.fillTankB();
        } else if (this.sensorA === 0 && this.sensorB === 1 && !this.isFillingA) {
            this.valveStatus = true;
            this.fillTankA();
        } else if (this.sensorA === 1 && this.sensorB === 1) {
            this.checkIfBothTanksFull();
        } else {
            this.valveStatus = false;
        }
        this.displayValveStatus();
    }

    fillTankAFirst() {
        this.isFillingA = true;
        const fillInterval = 50;
        let heightA = parseFloat(document.getElementById("waterA").style.height) || 0;
        let heightB = parseFloat(document.getElementById("waterB").style.height) || 0;

        const intervalId = setInterval(() => {
            if (heightA < 30 && heightB === 0) {
                heightA += 0.5;
                document.getElementById("waterA").style.height = `${heightA}%`;
            } else if (heightA >= 30 && heightB < 100) {
                heightB += 0.5;
                document.getElementById("waterB").style.height = `${heightB}%`;
            } else if (heightB >= 100 && heightA < 100) {
                heightA += 0.5;
                document.getElementById("waterA").style.height = `${heightA}%`;
            } else if (heightA >= 100 && heightB >= 100) {
                clearInterval(intervalId);
                this.isFillingA = false;
                this.checkIfBothTanksFull();
                this.addLog("Enchimento concluído.");
            }
        }, fillInterval);
    }

    fillTankA() {
        this.isFillingA = true;
        const fillInterval = 50;
        let heightA = parseFloat(document.getElementById("waterA").style.height) || 0;
        let heightB = parseFloat(document.getElementById("waterB").style.height) || 100;

        const intervalId = setInterval(() => {
            if (heightA < 30 && heightB === 100) {
                heightA += 0.5;
                document.getElementById("waterA").style.height = `${heightA}%`;
            } else if (heightA >= 30 && heightB < 100) {
                heightB += 0.5;
                document.getElementById("waterB").style.height = `${heightB}%`;
            } else if (heightB >= 100 && heightA < 100) {
                heightA += 0.5;
                document.getElementById("waterA").style.height = `${heightA}%`;
            } else if (heightA >= 100 && heightB >= 100) {
                clearInterval(intervalId);
                this.isFillingA = false;
                this.checkIfBothTanksFull();
                this.addLog("Enchimento concluído.");
            }
        }, fillInterval);
    }

    fillTankB() {
        this.isFillingB = true;
        const fillInterval = 50;
        let heightB = parseFloat(document.getElementById("waterB").style.height) || 0;
        let heightA = parseFloat(document.getElementById("waterA").style.height) || 0;

        const intervalId = setInterval(() => {
            if (heightB < 100 && heightA === 0) {
                heightB += 0.5;
                document.getElementById("waterB").style.height = `${heightB}%`;
            } else if (heightB >= 100 && heightA < 30) {
                heightA += 0.5;
                document.getElementById("waterA").style.height = `${heightA}%`;
            } else if (heightA >= 30 && heightB < 100) {
                heightB += 0.5;
                document.getElementById("waterB").style.height = `${heightB}%`;
            } else if (heightA >= 100 && heightB >= 100) {
                clearInterval(intervalId);
                this.isFillingB = false;
                this.checkIfBothTanksFull();
                this.addLog("Enchimento concluído.");
            }
        }, fillInterval);
    }

    checkIfBothTanksFull() {
        const heightA = parseFloat(document.getElementById("waterA").style.height) || 0;
        const heightB = parseFloat(document.getElementById("waterB").style.height) || 0;
        if (heightA >= 100 && heightB >= 100) {
            this.valveStatus = false;
        }
        this.displayValveStatus();
    }

    displayValveStatus() {
        const output = document.getElementById("output");
        output.innerHTML = `Valvula: ${this.valveStatus ? "Aberto" : "Fechado"}`;
    }

    addLog(message) {
        this.log.push(message);
        const logElement = document.getElementById("log");
        logElement.innerHTML = this.log.join('<br>');
    }

    updateVisuals() {
        document.getElementById("waterA").style.height = `${this.sensorA * 100}%`;
        document.getElementById("waterB").style.height = `${this.sensorB * 100}%`;
    }
}

const controlSystem = new AdvancedWaterFilterControlSystem();

document.getElementById("sensorA").addEventListener("change", function() {
    controlSystem.updateSensors(this.value, document.getElementById("sensorB").value);
});

document.getElementById("sensorB").addEventListener("change", function() {
    controlSystem.updateSensors(document.getElementById("sensorA").value, this.value);
});