function optionChanged(id) {
    var sample_id = id;
    console.log("Sample_id " + sample_id);
    updateAll(sample_id);
}

function id2index(id, data) {
    return data.names.indexOf(id);
}

function slice10rev(data){
    return data.slice(0,10).reverse();
}

function init(){
    d3.json("samples.json").then((data) => {
        console.log(data);

        //Populate selector options
        var selector = d3.select("#selDataset");
        
        selector.selectAll("option")
            .data(data.names)
            .enter()
            .append("option")
            .property("value",function(d){
                return d;
            })
            .text(function(d){
                return d;
            });

        // Grab initial value of selector and find the index of it in the data
        var idx = id2index(d3.select("#selDataset").property("value"), data);

        plotBar(idx, data);
        metadata(idx, data);
        plotBubble(idx, data);
        plotGauge(idx, data);
    });
}

function plotBar(idx, data){

    // Store the desired sample
    var sample = data.samples[idx];

    // Grab plot data: top 10 (pre sorted) then sort desc (reverse)
    var sample_values = slice10rev(sample.sample_values).map(val => val);
    // console.log(sample_values);
    var plot_labels = slice10rev(sample.otu_ids).map(id => "OTU " + id);
    // console.log(plot_labels);
    var plot_hovers = slice10rev(sample.otu_labels).map(label => label);
    // console.log(plot_hovers);

    var hzbar_trace = {
        orientation: "h",
        x: sample_values,
        y: plot_labels,
        text: plot_hovers,
        type: "bar"
    };

    var hzbar_data = [hzbar_trace];

    Plotly.newPlot("bar", hzbar_data);
}

function metadata(idx, data){

    var sample_meta = data.metadata[idx];

    // Select metadata div/data
    var meta_div = d3.select("#sample-metadata").selectAll("p")
        .data(Object.keys(sample_meta));

    // Show new data
    // Object.entries(sample_meta).forEach(([key, value]) => {
    //     var p_div = meta_div.append("p");
    //     p_div.text(key + ": " + value);
    // });
    console.log(sample_meta);
    meta_div.enter()
        .append("p")
        .merge(meta_div)
        .text(function (key){
            return key + ": " + sample_meta[key];
        });
    meta_div.exit().remove();
}

function plotBubble(idx, data){

    // Store the desired sample
    var sample = data.samples[idx];

    // Grab plot data: top 10 (pre sorted) then sort desc (reverse)
    var bubble_y_size = sample.sample_values.map(val => val);
    // console.log(sample_values);
    var bubble_x_color = sample.otu_ids.map(id => id);
    // console.log(plot_labels);
    var bubble_text = sample.otu_labels.map(label => label);
    // console.log(plot_hovers);

    var bubble_trace = {
        x: bubble_x_color,
        y: bubble_y_size,
        text: bubble_text,
        // type: "bubble",
        mode: "markers",
        marker: {
            size: bubble_y_size,
            color: bubble_x_color
        }
    };

    var layout = {
        xaxis: {
            title: "OTU ID"
        }
    };

    var bubble_data = [bubble_trace];

    Plotly.newPlot("bubble", bubble_data, layout);
}

function plotGauge(idx, data){
    var gaugeVal = data.metadata[idx].wfreq;

    var gauge = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: gaugeVal,
          title: { text: "Scrubs per Week" },
          type: "indicator",
          mode: "gauge",
        //   delta: { reference: 380 },
          gauge: {   
            bar: {
                color: "lightgrey",
                thickness: 0.3
                // color: function(gaugeVal){
                //     if (gaugeVal > 8){
                //         return "green";
                //     }else if (gaugeVal > 6){
                //         return "yellowgreen";
                //     }else if (gaugeVal > 4){
                //         return "yellow";
                //     }else if (gaugeVal > 2){
                //         return "orange";
                //     }else{
                //         return "red";
                //     }
                //}
            },
            axis: { range: [null, 9] },
            steps: [
              { range: [0, 2], color: "red" },
              { range: [2,4], color: "orange" },
              { range: [4,6], color: "yellow" },
              { range: [6,8], color: "yellowgreen" },
              { range: [8,10], color: "green" }
            ]
          }
        }
      ];
      
    //   var layout = {};

      Plotly.newPlot('gauge', gauge);
}

function updateAll(sample_id){
    d3.json("samples.json").then((data) => {
        // Convert id to index
        var idx = id2index(sample_id, data);
        // Call all 3 update functions
        plotBar(idx, data);
        plotBubble(idx, data);
        metadata(idx, data);
        plotGauge(idx, data);
    });
}

init();


