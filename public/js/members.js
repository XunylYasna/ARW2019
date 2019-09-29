var hi;

// alert(JSON.stringify(dataSet))
var dataArray = [];

for(var i = 0; i < dataSet.length;i++){
    dataArray[i] = [dataSet[i].ID_Number, dataSet[i].First_Name, dataSet[i].Last_Name, dataSet[i].Middle_Name, dataSet[i].College,dataSet[i].Degree_Program,dataSet[i].Contact_Number,dataSet[i].Facebook_Name,dataSet[i].Email,dataSet[i].Is_Officer,dataSet[i].Is_JO,dataSet[i].Position,dataSet[i].Receipt_Number];
    for(var g = 0; g <dataArray[i].length; g++){
        if(typeof dataArray[i][g] == 'undefined'){
            dataArray[i][g] = "-"
        }
    }
}

$(document).ready(function() {
    $('#LSCSTable').DataTable({
        data: dataArray,
        columns: [ 
            { title : "ID Number" },
            { title : "Last Name" },
            { title : "First Name" },
            { title : "Middle Name" },
            { title : "College" },
            { title : "Degree Program" },        
            { title : "Contact Number" },        
            { title : "Facebook Name" },
            { title : "Email" },
            { title : "Is Officer" },
            { title : "Is JO" },
            { title : "Position" },
            { title : "Receipt Number" }
        ]     
});

}); 