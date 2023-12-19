package at.maturaballmanager.services;

import at.maturaballmanager.model.Company;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.List;

public class CSVExport {

    public static ByteArrayInputStream
    companiesToCSV(List<Company> companies) {
        final CSVFormat format = CSVFormat.DEFAULT.
                withHeader("ID", "Name", "Address", "Website");

        try (

                ByteArrayOutputStream out = new ByteArrayOutputStream();
                CSVPrinter csvPrinter =
                        new CSVPrinter(new PrintWriter(out), format);) {
            for (Company comp : companies) {
                List<String> data = Arrays.asList(comp.id.toString(), comp.name, comp.address.toString(), comp.website);
                csvPrinter.printRecord(data);
            }

            csvPrinter.flush();
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("fail to import data to CSV file: "
                    + e.getMessage());
        }
    }
}
