from dotenv import load_dotenv
import spacy
import os
from neo4j import GraphDatabase, Driver, Transaction
from flask import Flask, request, jsonify

load_dotenv()
nlp = spacy.load("en_core_web_sm")
app = Flask(__name__)

# Create a driver instance
driver = GraphDatabase.driver(
    os.getenv("NEO4J_URI"),
    auth=(os.getenv("NEO4J_USERNAME"), os.getenv("NEO4J_PASSWORD")),
)
# Optionally, check if you want to verify connectivity at the start
driver.verify_connectivity()


def extract_entities(responses):
    for response in responses:
        doc = nlp(response)
        objects = []
        communities = []
        for token in doc:
            # Extracting Objects based on dependency parsing
            if token.dep_ in [
                "dobj",
                "attr",
                "pobj",
            ]:  # direct objects, attributes, object of preposition
                objects.append(token.text)

        print(f"Response: {response}")
        print("Extracted Objects:", list(set(objects)))
        print("Extracted Groups/Communities:", list(set(communities)))
        print()


def extract_entities(response):

    doc = nlp(response.get("answer", "") + " " + response.get("ukraine", ""))
    actions = set()
    roles = set()
    resources = set()
    communities = set()

    for token in doc:
        # Action extraction
        if token.pos_ == "VERB":
            actions.add(token.lemma_)
        # Role and resource extraction (simplified for demonstration)
        if token.pos_ == "NOUN":
            if "coordinator" in token.text:
                roles.add(token.text)
            else:
                resources.add(token.text)

        # Extracting Groups/Communities if mentioned explicitly
        if token.ent_type_ in [
            "NORP",
            "ORG",
            "GPE",
        ]:  # nationalities, organizations, geopolitical entities
            communities.add(token.text)
        # Additional heuristic: Check for noun chunks that might be groups
        for chunk in doc.noun_chunks:
            if (
                "community" in chunk.text
                or "neighborhood" in chunk.text
                or "families" in chunk.text
            ):
                communities.add(chunk.text)

    return {
        "user": response.get("user", "Anonymous"),
        "actions": list(actions),
        "roles": list(roles),
        "resources": list(resources),
        "communities": list(communities),
    }


# Function to insert data into Neo4j
def insert_data_into_neo4j(driver, entry):
    with driver.session() as session:
        session.write_transaction(create_nodes_and_relationships, entry)


# Transaction function to create nodes and relationships
def create_nodes_and_relationships(tx, entry):
    # Create or find the user node
    tx.run(
        """
        MERGE (u:User {name: $name})
        SET u.answer = $answer, u.ukraine_help = $ukraine_help
        """,
        name=entry.get("user", "Anonymous"),
        answer=entry.get("answer", ""),
        ukraine_help=entry.get("ukraine", ""),
    )

    # Create action nodes and relationships
    for action in entry["actions"]:
        tx.run(
            """
            MATCH (u:User {name: $name})
            MERGE (a:Action {name: $action})
            MERGE (u)-[:PERFORMS]->(a)
            """,
            name=entry["user"],
            action=action,
        )

    # Create role nodes and relationships
    for role in entry["roles"]:
        tx.run(
            """
            MATCH (u:User {name: $name})
            MERGE (r:Role {name: $role})
            MERGE (u)-[:ASSUMES]->(r)
            """,
            name=entry["user"],
            role=role,
        )

    # Create resource nodes and relationships
    for resource in entry["resources"]:
        tx.run(
            """
            MATCH (u:User {name: $name})
            MERGE (res:Resource {name: $resource})
            MERGE (u)-[:UTILIZES]->(res)
            """,
            name=entry["user"],
            resource=resource,
        )

    # Create community nodes and relationships
    for community in entry["communities"]:
        tx.run(
            """
            MATCH (u:User {name: $name})
            MERGE (c:Community {name: $community})
            MERGE (u)-[:BELONGS_TO]->(c)
            """,
            name=entry["user"],
            community=community,
        )


@app.route("/process", methods=["POST"])
def process_data():
    data = request.json
    print(data)

    response = {
        "user": data.get("user", "Anonymous"),
        "answer": data.get("answer", ""),
        "ukraine": data.get("ukraine", ""),
    }
    # Extract data
    extracted_data = extract_entities(response)

    # Insert data into Neo4j
    insert_data_into_neo4j(driver, {**response, **extracted_data})

    return (
        jsonify({"message": "Data processed successfully", "data": extracted_data}),
        200,
    )


@app.route("/status", methods=["GET"])
def status():
    return jsonify({"status": "Service is up and running"})


if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")
